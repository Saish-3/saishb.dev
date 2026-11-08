import { AnimatePresence, motion } from "framer-motion";
import type { Player } from "../content";

export default function StoryCard({
  player,
  chapter,
  visible,
}: {
  player: Player;
  chapter: number;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          key={`${player.shirt}-${chapter}`}
          className="story-card"
          data-testid="story-card"
          aria-label={`Chapter ${chapter} of 11: ${player.title}`}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="sc-top mono">
            <span className="sc-chapter">{String(chapter).padStart(2, "0")}/11</span>
            <span className="sc-shirt">
              SHIRT {player.shirt} · {player.role}
            </span>
          </div>
          <h3 className="sc-title display">{player.title}</h3>
          <p className="sc-body">{player.story}</p>
          <div className="sc-tags mono">
            {player.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
