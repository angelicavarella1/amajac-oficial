"use client";

import { motion } from "framer-motion";

export default function AmajacBanner() {
  return (
    <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] overflow-hidden">
      {/* Background image */}
      <img
        src="/images/hero-banner.svg"
        alt="Bandeira da AMAJAC"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20"
            >
              Itaipuaçu • Maricá • RJ
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl"
            >
              Associação de Moradores do{" "}
              <span className="text-green-300">Jardim Atlântico Central</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-3 text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl leading-relaxed"
            >
              Juntos pelo desenvolvimento urbano e social do nosso bairro desde 2019.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto fill-white dark:fill-gray-950">
          <path d="M0,40 C320,10 480,60 720,30 C960,0 1120,50 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </div>
  );
}
