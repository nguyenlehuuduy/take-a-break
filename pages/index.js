import React from "react";
import Head from "next/head";
import useCountDown from "react-countdown-hook";
import styles from "../styles/Home.module.css";
import { formatTime } from "../lib/util";
import Image from "next/image";

export default function Home() {
  const [session, setSession] = React.useState("inactive");
  const [mouseMoved, setMouseMoved] = React.useState(false);
  const [tabHasFocus, setTabHasFocus] = React.useState(true);
  const [initialTime, setInitialTime] = React.useState(2 * 60 * 1000);
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, 1000);

  const restart = React.useCallback((newTime) => start(newTime), [start]);
  const timerIsActive = timeLeft > 0;

  const handleMouseMove = () => {
    if (timerIsActive) {
      let timer;

      restart(initialTime);
      setMouseMoved(true);

      if (!tabHasFocus) setTabHasFocus(true);

      clearTimeout(timer);
      timer = setTimeout(() => {
        setMouseMoved(false);
      }, 1000);
    }
  };

  React.useEffect(() => {
    const handleFocus = () => {
      console.log("Tab has focus");

      if (timerIsActive) {
        setTabHasFocus(true);
      }
    };

    const handleBlur = () => {
      console.log("Tab lost focus");
      if (timerIsActive) {
        restart(initialTime);
        setTabHasFocus(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [timerIsActive, initialTime, restart]);

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      <Head>
        <title>Nghỉ ngơi một lát nhé</title>
        <meta name="description" content="Hãy nghỉ ngơi từ thói quen hàng ngày của bạn." />
        <link rel="icon" href="/mug.svg" />
      </Head>

      <main>
        {session === "inactive" && (
          <>
            <Image alt="Mug" src="/mug.svg" width={100} height={100} />
            <h2>Hãy thoát khỏi mọi ồn ào và trân trọng vẻ đẹp của sự im lặng</h2>
            <div className="btn-group">
              <button
                className={initialTime === 2 * 60 * 1000 ? "" : "btn-inactive"}
                onClick={() => setInitialTime(2 * 60 * 1000)}
              >
                2 Phút
              </button>
              <button
                className={initialTime === 3 * 60 * 1000 ? "" : "btn-inactive"}
                onClick={() => setInitialTime(3 * 60 * 1000)}
              >
                3 Phút
              </button>
              <button
                className={initialTime === 5 * 60 * 1000 ? "" : "btn-inactive"}
                onClick={() => setInitialTime(5 * 60 * 1000)}
              >
                5 Phút
              </button>
            </div>
            <button
              className="main-btn"
              onClick={() => {
                setSession("active");
                start(initialTime);
              }}
            >
              Bắt đầu enjoy thôi nào
            </button>
          </>
        )}

        {session === "active" && (
          <>
            {timerIsActive ? (
              <div>
                <h1>{formatTime(timeLeft / 1000)}</h1>
                <div className="timer_detail">
                  <p onClick={pause}>Đừng di chuyển con trỏ của bạn. Chỉ cần ngồi lại, thư giãn và thở thôi.</p>

                  {(mouseMoved || !tabHasFocus) && <p className="oops">Ôi không! Thử lại</p>}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="h2-main">Bạn làm được rồi!</h2>
                <h2>hôm nay bạn đã làm rất tốt.</h2>
                <h2>Hãy nhớ rằng, nghỉ ngơi là được.</h2>
                <button
                  className="main-btn done-btn"
                  onClick={() => {
                    console.log(timeLeft);
                    console.log(timerIsActive);
                    setSession("inactive");
                  }}
                >
                 Nghỉ ngơi nữa nhé?
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
