"use client"

import { RiPlayCircleFill } from "@remixicon/react";
import Link from "next/link";
import { Button } from "../Button";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative py-20  mt-16"
    >
      {/* Background gradient circles for visual flair */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-50 blur-3xl opacity-70 dark:bg-emerald-900/20" />
      <div className="absolute top-1/2 right-1/4 h-64 w-64 rounded-full bg-teal-50 blur-3xl opacity-60 dark:bg-teal-900/20" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/70 px-4 py-1.5 mb-6 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>
                Découvrez notre agent qui accompagne les médecins au quotidien.
              </span>
            </div>

            <h1
              id="hero-title"
              className="text-5xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-600 via-emerald-800 to-teal-600 bg-clip-text leading-tight"
            >
              La santé accessible. <br /> Pour tous, partout.
            </h1>

            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
              Une plateforme gratuite de consultations médicales à distance, pensée
              pour briser les barrières géographiques et rendre les soins
              accessibles à chacun.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild className="h-12 px-6 font-medium text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all duration-300 dark:shadow-emerald-900/30">
                <Link href="/signup">
                  Découvrir la plateforme
                </Link>
              </Button>

              <Button
                asChild
                variant="light"
                className="h-12 px-6 font-medium text-base gap-2 group bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <Link
                  href="https://www.youtube.com/watch?v=QRZ_l7cVzzU"
                  target="_blank"
                >
                  <span className="flex items-center justify-center rounded-full bg-emerald-50 h-6 w-6 transition-all group-hover:bg-emerald-100 dark:bg-gray-700 dark:group-hover:bg-gray-600">
                    <RiPlayCircleFill
                      aria-hidden="true"
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                    />
                  </span>
                  Voir la démo
                </Link>
              </Button>
            </div>

            {/* Social proof or stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100K+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">24/7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">98%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
              </div>
            </div>
          </motion.div>

          {/* Image with floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative select-none pointer-events-none">
              <Image
                src="/images/home2.png"
                height={650}
                width={650}
                alt="Plateforme de téléconsultation"
                className="relative z-10 select-none pointer-events-none"
                priority
                quality={100}
                draggable={false}
              />

              {/* Blurry gradient at the bottom of the image */}
              <div className="absolute z-20 left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/50 dark:from-gray-950 dark:via-gray-950/40 to-transparent pointer-events-none transition-all duration-700 ease-in-out" />

              {/* Floating UI elements */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -left-12 top-12 z-20 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 animate-float select-none pointer-events-none"
              >
                <div className="flex items-center gap-3 ">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 ">Consultation confirmée</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">À l&apos;instant</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -right-12 bottom-24 z-20 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 animate-float select-none pointer-events-none"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Rapide & Efficace</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Moins de 1 min d&apos;attente</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-950 dark:via-gray-950" />
    </section>
  );
}