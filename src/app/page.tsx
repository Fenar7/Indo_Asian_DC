export default function Home() {
  return (
    <main className="flex min-h-screen bg-cloud-grey px-6 py-10 text-pure-black sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-[32px] border border-stroke-grey bg-pure-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-12">
        <div className="flex flex-col gap-3 border-b border-stroke-grey pb-6">
          <span className="text-sm font-medium uppercase tracking-[0.32em] text-hash-grey-2">
            Global Style Check
          </span>
          <h1 className="font-sf-pro text-5xl font-bold leading-none sm:text-7xl">
            SF Pro is live.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-hash-grey-2 sm:text-xl">
            This temporary page is only here to verify the global fonts,
            Tailwind color tokens, and the base style layer before actual
            frontend development starts.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] bg-pure-black p-8 text-pure-white">
            <p className="text-sm uppercase tracking-[0.28em] text-cloud-grey">
              Font Weights
            </p>
            <div className="mt-6 space-y-3">
              <p className="font-sf-pro text-2xl font-light">
                SF Pro Light 300
              </p>
              <p className="font-sf-pro text-2xl font-normal">
                SF Pro Regular 400
              </p>
              <p className="font-sf-pro text-2xl font-medium">
                SF Pro Medium 500
              </p>
              <p className="font-sf-pro text-2xl font-semibold">
                SF Pro Semibold 600
              </p>
              <p className="font-sf-pro text-2xl font-bold">
                SF Pro Bold 700
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-stroke-grey bg-cloud-grey p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-hash-grey-2">
              Color Tokens
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-pure-black p-4 text-pure-white">
                <p className="text-sm font-medium">Pure Black</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">#000</p>
              </div>
              <div className="rounded-2xl border border-stroke-grey bg-pure-white p-4 text-pure-black">
                <p className="text-sm font-medium">Pure White</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">#fff</p>
              </div>
              <div className="rounded-2xl bg-hash-grey-2 p-4 text-pure-white">
                <p className="text-sm font-medium">Hash Grey 2</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">
                  #767676
                </p>
              </div>
              <div className="rounded-2xl bg-main-cta-red p-4 text-pure-white">
                <p className="text-sm font-medium">Main CTA Red</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em]">
                  #DC2B1B
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="rounded-[24px] border border-stroke-grey bg-pure-white p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-hash-grey-2">
              Mixed Test Block
            </p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-pure-black">
              If this page looks clean, uses SF Pro everywhere, and the red,
              grey, black, and white values match what you expect, the global
              style setup is ready.
            </p>
          </div>

          <button className="inline-flex items-center justify-center rounded-full bg-main-cta-red px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-pure-white">
            CTA Sample
          </button>
        </div>
      </section>
    </main>
  );
}
