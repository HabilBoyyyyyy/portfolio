"use client";

import {useRef} from "react";
import Image from "next/image";
import styles from "./TiltCard.module.css";
import {useTilt} from "./useTilt";

type Props = {
  name: string;
  role: string;
  location: string;
  status: string;
  photo: string;
};

export default function TiltCard({name, role, location, status, photo}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  useTilt(stageRef);

  // "Habil Baihaki Ramadhan" -> big "Habil", smaller "Baihaki Ramadhan"
  const [first, ...rest] = name.split(" ");

  return (
    // The entrance animation lives on its own wrapper so its transform never
    // fights with the tilt transform on the card.
    <div className={styles.entrance}>
      <div ref={stageRef} className={styles.stage}>
        {/* Layer 1: glow behind the card */}
        <div className={styles.glow} aria-hidden />
        {/* Layer 2: soft shadow cast on the "wall" */}
        <div className={styles.wallShadow} aria-hidden />

        {/* Layer 3: the card shell */}
        <div className={styles.card}>
          {/* Sub-layer A: photo with parallax */}
          <div className={styles.photoWrap}>
            <Image
              src={photo}
              alt={`Portrait of ${name}`}
              fill
              priority
              sizes="(max-width: 640px) 80vw, 430px"
              className={styles.photo}
            />
          </div>

          {/* Sub-layer B: gradient name */}
          <div className={styles.name}>
            <span className={styles.first}>{first}</span>
            {rest.length > 0 && (
              <span className={styles.rest}>{rest.join(" ")}</span>
            )}
          </div>

          {/* Sub-layer C: glass info bar */}
          <div className={styles.info}>
            <p className={styles.role}>{role}</p>
            <div className={styles.row}>
              <p className={styles.location}>{location}</p>
              <p className={styles.status}>
                <span className={styles.dot} aria-hidden />
                {status}
              </p>
            </div>
          </div>

          {/* Layer 4: holographic shine */}
          <div className={styles.shine} aria-hidden />
          {/* Layer 5: pointer glare */}
          <div className={styles.glare} aria-hidden />
        </div>

        {/* Layer 6: the pushpin, on top, holding the card to the wall */}
        <span className={styles.pin} aria-hidden />
      </div>
    </div>
  );
}
