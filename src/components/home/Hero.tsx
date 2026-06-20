
"use client"

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative h-[90vh] overflow-hidden">
      <Image
        src="https://picsum.photos/seed/hero-stationery/1920/1080"
        alt="Elegant stationery hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative container mx-auto h-full px-6 flex flex-col justify-center items-start text-white max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <Badge className="bg-accent/80 backdrop-blur-md text-white border-none py-1.5 px-4 rounded-full text-xs font-medium uppercase tracking-[0.2em]">
            New Collection 2024
          </Badge>
          <h1 className="font-headline text-6xl md:text-8xl font-bold leading-tight">
            Write Your <br />
            <span className="text-primary italic">Signature</span> Story
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed font-body">
            Discover a world of exquisite paper goods and precision writing instruments designed for those who appreciate the tactile beauty of expression.
          </p>
          <div className="flex gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-8 text-md rounded-full">
              <Link href="/catalog">Shop Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-md text-white border-white hover:bg-white hover:text-primary rounded-full">
              View Lookbook
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("inline-block", className)}>{children}</div>;
}
