"use client";

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import * as skinview3d from 'skinview3d';

interface MinecraftSkinViewerProps {
  initialUsername: string;
}

export default function MinecraftSkinViewer({ initialUsername }: MinecraftSkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skinViewerRef = useRef<skinview3d.SkinViewer | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Initialize SkinViewer when script is loaded and canvas is ready
  useEffect(() => {
    if (isScriptLoaded && canvasRef.current) {
      if (!skinViewerRef.current) { // Initialize only once
        const viewer = new skinview3d.SkinViewer({
          canvas: canvasRef.current,
          width: 300,
          height: 400,
          skin: `https://minotar.net/skin/${initialUsername}` || "https://minotar.net/skin/Steve"
        });

        // Visual configuration
        viewer.fov = 70;
        viewer.zoom = 0.9;
        
        // Enable mouse controls (rotar/zoom)
        const control = skinview3d.createOrbitControls(viewer);
        control.enableZoom = true;
        control.enableRotate = true;

        // Initial animation (Walking)
        viewer.animation = new skinview3d.WalkingAnimation();
        
        skinViewerRef.current = viewer;

      } else {
        // If viewer exists, just update the skin if initialUsername changed
        if (skinViewerRef.current.skinUrl !== `https://minotar.net/skin/${initialUsername}`) {
            skinViewerRef.current.loadSkin(`https://minotar.net/skin/${initialUsername}`);
        }
      }
    }
  }, [isScriptLoaded, initialUsername]);

  // Function to change animation
  const setAnimation = (type: 'walk' | 'run' | 'idle') => {
    if (skinViewerRef.current) {
      if (type === 'walk') skinViewerRef.current.animation = new skinview3d.WalkingAnimation();
      if (type === 'run') skinViewerRef.current.animation = new skinview3d.RunningAnimation();
      if (type === 'idle') skinViewerRef.current.animation = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl border-2 border-luma-DEFAULT shadow-[0_0_15px_rgba(255,213,0,0.3)] w-full">
      {/* Script for skinview3d library */}
      <Script
        src="https://cdn.jsdelivr.net/npm/skinview3d@3.0.0-alpha.1/dist/skinview3d.bundle.js"
        strategy="lazyOnload" // Load script after page is interactive
        onLoad={() => setIsScriptLoaded(true)}
      />
      
      <canvas id="skin_container" ref={canvasRef} className="cursor-move rounded-lg bg-gradient-to-b from-gray-900 to-transparent w-[300px] h-[400px]"></canvas>

      <div className="mt-6 flex gap-4 w-full max-w-sm justify-center">
          <button onClick={() => setAnimation('walk')} 
                  className="bg-craft-DEFAULT hover:bg-craft-light text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-craft-light/20">
              Caminar
          </button>
          <button onClick={() => setAnimation('run')} 
                  className="bg-luma-DEFAULT hover:bg-luma-light text-night-DEFAULT font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-luma-light/20">
              Correr
          </button>
          <button onClick={() => setAnimation('idle')} 
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-600/20">
              Quieto
          </button>
      </div>
    </div>
  );
}