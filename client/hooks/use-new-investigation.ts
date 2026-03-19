'use client';

import 'client-only';

import {useTransition} from 'react';
import {useImmerReducer} from 'use-immer';
import {useRouter} from 'next/navigation';
import {generatePlan, startInvestigation} from '@/client/investigations/api';
import type {InvestigationWorkflowInput} from '@/shared/investigations/schema';

export type Step = 'prompt' | 'review' | 'launch';

export type NewInvestigationState = {
  step: Step;
  prompt: string;
  promptError: string | null;
  planError: string | null;
  startError: string | null;
  plannedInput: InvestigationWorkflowInput | null;
};

type Action =
  | {type: 'PROMPT_CHANGED'; payload: string}
  | {type: 'PROMPT_VALIDATION_FAILED'; payload: string}
  | {type: 'PLAN_GENERATION_STARTED'}
  | {type: 'PLAN_GENERATED'; payload: InvestigationWorkflowInput}
  | {type: 'PLAN_GENERATION_FAILED'; payload: string}
  | {type: 'PLAN_EDITED'; payload: Partial<InvestigationWorkflowInput>}
  | {type: 'PROCEED_TO_LAUNCH'}
  | {type: 'INVESTIGATION_START_REQUESTED'}
  | {type: 'INVESTIGATION_START_FAILED'; payload: string}
  | {type: 'BACK_TO_PROMPT_REQUESTED'}
  | {type: 'BACK_TO_REVIEW_REQUESTED'};

function reducer(draft: NewInvestigationState, action: Action) {
  switch (action.type) {
    case 'PROMPT_CHANGED':
      draft.prompt = action.payload;
      break;
    case 'PROMPT_VALIDATION_FAILED':
      draft.promptError = action.payload;
      break;
    case 'PLAN_GENERATION_STARTED':
      draft.promptError = null;
      draft.planError = null;
      break;
    case 'PLAN_GENERATED':
      draft.plannedInput = action.payload;
      draft.step = 'review';
      draft.promptError = null;
      draft.planError = null;
      break;
    case 'PLAN_GENERATION_FAILED':
      draft.planError = action.payload;
      break;
    case 'PLAN_EDITED':
      if (draft.plannedInput) {
        Object.assign(draft.plannedInput, action.payload);
      }
      break;
    case 'PROCEED_TO_LAUNCH':
      draft.step = 'launch';
      draft.startError = null;
      break;
    case 'INVESTIGATION_START_REQUESTED':
      draft.startError = null;
      break;
    case 'INVESTIGATION_START_FAILED':
      draft.startError = action.payload;
      break;
    case 'BACK_TO_PROMPT_REQUESTED':
      draft.step = 'prompt';
      draft.planError = null;
      draft.startError = null;
      break;
    case 'BACK_TO_REVIEW_REQUESTED':
      draft.step = 'review';
      draft.startError = null;
      break;
  }
}

const initialState: NewInvestigationState = {
  step: 'prompt',
  prompt: '',
  promptError: null,
  planError: null,
  startError: null,
  plannedInput: null,
};

const CHARACTER_LIMIT = 2000;

function validatePrompt(prompt: string): string | null {
  if (!prompt) return 'Describe what you want to investigate first.';
  return null;
}

export function useNewInvestigation() {
  const router = useRouter();
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();

  const characterCount = state.prompt.length;
  const remainingCharacters = CHARACTER_LIMIT - characterCount;

  async function generatePlanAction(formData: FormData) {
    const trimmed = ((formData.get('prompt') as string) || '').trim();
    const error = validatePrompt(trimmed);
    if (error) {
      dispatch({type: 'PROMPT_VALIDATION_FAILED', payload: error});
      return;
    }

    dispatch({type: 'PLAN_GENERATION_STARTED'});

    try {
      const plan = await generatePlan(trimmed);
      dispatch({
        type: 'PLAN_GENERATED',
        payload: {...plan, geography: plan.geography || 'Global'},
      });
    } catch (error) {
      dispatch({
        type: 'PLAN_GENERATION_FAILED',
        payload:
          error instanceof Error ? error.message : 'Failed to analyze your investigation idea.',
      });
    }
  }

  function handleStartInvestigation() {
    if (!state.plannedInput) return;

    dispatch({type: 'INVESTIGATION_START_REQUESTED'});

    startTransition(async () => {
      const plannedInput = state.plannedInput!;
      try {
        const runId = await startInvestigation({
          title: plannedInput.title,
          description: plannedInput.description ?? '',
          category: plannedInput.category,
          geography: plannedInput.geography || 'Global',
          phases: plannedInput.phases,
        });
        router.push(`/dashboard/investigations/${runId}`);
      } catch (error) {
        dispatch({
          type: 'INVESTIGATION_START_FAILED',
          payload: error instanceof Error ? error.message : 'Failed to start investigation.',
        });
      }
    });
  }

  function setPrompt(value: string) {
    if (value.length <= CHARACTER_LIMIT) {
      dispatch({type: 'PROMPT_CHANGED', payload: value});
    }
  }

  function editPlan(payload: Partial<InvestigationWorkflowInput>) {
    dispatch({type: 'PLAN_EDITED', payload});
  }

  function proceedToLaunch() {
    dispatch({type: 'PROCEED_TO_LAUNCH'});
  }

  function resetToPrompt() {
    dispatch({type: 'BACK_TO_PROMPT_REQUESTED'});
  }

  function backToReview() {
    dispatch({type: 'BACK_TO_REVIEW_REQUESTED'});
  }

  return {
    state,
    characterLimit: CHARACTER_LIMIT,
    remainingCharacters,
    isStartPending: isPending,
    generatePlanAction,
    handleStartInvestigation,
    setPrompt,
    editPlan,
    proceedToLaunch,
    resetToPrompt,
    backToReview,
  };
}
