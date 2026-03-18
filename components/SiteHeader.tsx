"use client";

import { Link } from "@/components/ui/Link";
import {
  Button as RACButton,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

function HamburgerIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--tm-color-neutral-100) bg-(--tm-color-neutral-50)/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="inline-block h-5 w-1 rounded-sm bg-(--tm-color-accent-500)" />
          <span className="font-serif text-lg font-semibold tracking-tight text-(--tm-color-primary-900)">
            TrueMotives
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/reports"
            className="text-sm font-medium text-(--tm-color-neutral-600) transition-colors hover:text-(--tm-color-primary-900)"
          >
            Browse reports
          </Link>
          <span className="text-sm text-(--tm-color-neutral-300)">|</span>
          <Link
            href="/pricing"
            className="text-sm font-medium text-(--tm-color-neutral-600) transition-colors hover:text-(--tm-color-primary-900)"
          >
            Pricing
          </Link>
        </div>

        {/* Mobile hamburger + drawer */}
        <div className="sm:hidden">
          <DialogTrigger>
            <RACButton
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-(--tm-color-neutral-600) transition-colors hover:bg-(--tm-color-neutral-100) hover:text-(--tm-color-primary-900) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--tm-color-accent-400)"
            >
              <HamburgerIcon />
            </RACButton>
            <ModalOverlay
              isDismissable
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm entering:animate-in entering:fade-in entering:duration-200 exiting:animate-out exiting:fade-out exiting:duration-150"
            >
              <Modal className="fixed top-0 right-0 bottom-0 w-64 bg-(--tm-color-neutral-50) shadow-2xl entering:animate-in entering:slide-in-from-right entering:duration-300 entering:ease-out exiting:animate-out exiting:slide-out-to-right exiting:duration-200 exiting:ease-in">
                <Dialog className="flex h-full flex-col outline-none">
                  {({ close }) => (
                    <>
                      <div className="flex h-14 items-center justify-between border-b border-(--tm-color-neutral-100) px-6">
                        <Heading
                          slot="title"
                          className="font-serif text-lg font-semibold text-(--tm-color-primary-900)"
                        >
                          Menu
                        </Heading>
                        <RACButton
                          onPress={close}
                          aria-label="Close menu"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-(--tm-color-neutral-600) transition-colors hover:bg-(--tm-color-neutral-100) hover:text-(--tm-color-primary-900)"
                        >
                          <CloseIcon />
                        </RACButton>
                      </div>
                      <div className="flex flex-col gap-1 px-4 py-4">
                        <Link
                          href="/reports"
                          onPress={close}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-(--tm-color-neutral-600) transition-colors hover:bg-(--tm-color-neutral-100) hover:text-(--tm-color-primary-900)"
                        >
                          Browse reports
                        </Link>
                        <Link
                          href="/pricing"
                          onPress={close}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-(--tm-color-neutral-600) transition-colors hover:bg-(--tm-color-neutral-100) hover:text-(--tm-color-primary-900)"
                        >
                          Pricing
                        </Link>
                      </div>
                    </>
                  )}
                </Dialog>
              </Modal>
            </ModalOverlay>
          </DialogTrigger>
        </div>
      </nav>
    </header>
  );
}
