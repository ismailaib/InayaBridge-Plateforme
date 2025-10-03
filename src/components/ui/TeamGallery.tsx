import { InstaxImage } from "./InstaxImage";

export default function TeamGallery() {
  return (
    <section
      aria-labelledby="teamwork-title"
      className="mx-auto mt-5 max-w-4xl animate-slide-up-fade"
      style={{
        animationDuration: "600ms",
        animationDelay: "200ms",
        animationFillMode: "backwards",
      }}
    >
      <div className="mt-20">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            className="w-[25rem] -rotate-6 sm:-ml-5"
            src="/images/teamwork.png"
            alt="On planifie, on discute, on code"
            width={640}
            height={427}
            caption="On planifie, on discute, on code"
          />
          <InstaxImage
            className="w-[15rem] rotate-3"
            src="/images/devcoding.png"
            alt="L’interface ne va pas se designer toute seule."
            width={640}
            height={853}
            caption="L’interface ne va pas se designer toute seule."
          />
          <InstaxImage
            className="-mr-10 w-[15rem] rotate-1"
            src="/images/planing.png"
            alt="Picture of the Fraumunster Zurich"
            width={640}
            height={427}
            caption="L’équipe ? Pas une famille"
          />
        </div>
      </div>
      <div className="mt-28">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            className="w-full rotate-1"
            src="/images/founders.webp"
            alt=" Join Database, be yourself."
            width={1819}
            height={998}
            caption="Joindre InayaBridge "
          />
        </div>
      </div>
    </section>
  );
}
