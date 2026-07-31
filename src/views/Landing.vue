<template>
  <div class="landing">
    <div class="atmosphere" aria-hidden="true">
      <div class="orb orb-green"></div>
      <div class="orb orb-yellow"></div>
      <div class="orb orb-blue"></div>
      <div class="mesh"></div>
    </div>

    <header class="nav">
      <router-link to="/" class="nav-brand">
        <img src="/image/logo.png" alt="" class="nav-logo" />
        <span>JuanCharge</span>
      </router-link>
      <q-btn
        unelevated
        no-caps
        label="Sign In"
        class="nav-cta"
        @click="$router.push('/login')"
      />
    </header>

    <main>
      <section class="hero">
        <div class="hero-mark">
          <img src="/image/logo.png" alt="JuanCharge" class="hero-logo" />
        </div>
        <h1 class="hero-brand">JuanCharge</h1>
        <p class="hero-tagline">Powering Every Juan.</p>
        <p class="hero-support">
          The Philippine EV charging network that rewards recycling —
          locate stations, earn points, and charge cleaner.
        </p>
        <div class="hero-actions">
          <q-btn
            unelevated
            no-caps
            label="Sign In"
            class="btn-primary"
            @click="$router.push('/login')"
          />
          <button type="button" class="btn-ghost" @click="scrollToFeatures">
            See how it works
            <q-icon name="arrow_downward" size="18px" />
          </button>
        </div>
      </section>

      <section id="how-it-works" class="features" ref="features">
        <h2 class="section-title">How JuanCharge works</h2>
        <p class="section-support">
          One platform for finding power, earning from recycling, and charging on the go.
        </p>

        <ul class="feature-list">
          <li
            v-for="(feature, index) in features"
            :key="feature.title"
            class="feature-item"
            :class="`accent-${feature.tone}`"
            :style="{ animationDelay: `${0.1 + index * 0.12}s` }"
          >
            <div class="feature-icon" aria-hidden="true">
              <q-icon :name="feature.icon" size="28px" />
            </div>
            <div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section class="closing">
        <h2 class="closing-brand">JuanCharge</h2>
        <p class="closing-copy">Ready to power your next trip?</p>
        <q-btn
          unelevated
          no-caps
          label="Go to Sign In"
          class="btn-primary"
          @click="$router.push('/login')"
        />
      </section>
    </main>

    <footer class="footer">
      <span>© {{ year }} JuanCharge. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Landing",
  data() {
    return {
      year: new Date().getFullYear(),
      features: [
        {
          title: "Locate stations",
          description:
            "Find nearby EV charging kiosks across the Philippines and plan your stop with confidence.",
          icon: "map",
          tone: "green",
        },
        {
          title: "Recycle & earn",
          description:
            "Drop recyclables at participating kiosks and convert points into charging time.",
          icon: "recycling",
          tone: "yellow",
        },
        {
          title: "Charge & go",
          description:
            "Start a session, track progress, and keep every Juan moving on cleaner energy.",
          icon: "bolt",
          tone: "blue",
        },
      ],
    };
  },
  methods: {
    scrollToFeatures() {
      const el = this.$refs.features;
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap");

.landing {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: "Plus Jakarta Sans", sans-serif;
  color: #0f172a;
  background:
    radial-gradient(120% 80% at 10% -10%, rgba(34, 197, 94, 0.18), transparent 55%),
    radial-gradient(90% 70% at 100% 0%, rgba(37, 99, 235, 0.12), transparent 50%),
    radial-gradient(80% 60% at 80% 100%, rgba(234, 179, 8, 0.14), transparent 45%),
    linear-gradient(180deg, #f8fafc 0%, #eef7f1 45%, #f8fafc 100%);
}

.atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  animation: drift 18s ease-in-out infinite alternate;
}

.orb-green {
  width: min(52vw, 420px);
  height: min(52vw, 420px);
  top: -8%;
  left: -6%;
  background: rgba(34, 197, 94, 0.45);
}

.orb-yellow {
  width: min(40vw, 320px);
  height: min(40vw, 320px);
  top: 18%;
  right: -4%;
  background: rgba(234, 179, 8, 0.35);
  animation-delay: -6s;
}

.orb-blue {
  width: min(46vw, 360px);
  height: min(46vw, 360px);
  bottom: 8%;
  left: 35%;
  background: rgba(37, 99, 235, 0.28);
  animation-delay: -11s;
}

.mesh {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(22, 163, 74, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22, 163, 74, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 85%);
}

@keyframes drift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(24px, 18px) scale(1.06);
  }
}

.nav,
main,
.footer {
  position: relative;
  z-index: 1;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: #14532d;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}

.nav-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 10px;
}

.nav-cta {
  height: 40px;
  padding: 0 1.1rem;
  border-radius: 12px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
}

.hero {
  min-height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1.5rem 4rem;
  max-width: 820px;
  margin: 0 auto;
}

.hero-mark {
  width: min(42vw, 180px);
  height: min(42vw, 180px);
  display: grid;
  place-items: center;
  margin-bottom: 1.5rem;
  border-radius: 36px;
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.95), rgba(240, 253, 244, 0.75));
  box-shadow:
    0 24px 50px -20px rgba(22, 163, 74, 0.35),
    0 0 0 1px rgba(22, 163, 74, 0.12);
  animation: rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-logo {
  width: 72%;
  height: auto;
  object-fit: contain;
  animation: pulseSoft 4.5s ease-in-out infinite;
}

.hero-brand {
  margin: 0;
  font-size: clamp(2.75rem, 8vw, 4.75rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 55%, #2563eb 130%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rise 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}

.hero-tagline {
  margin: 0.85rem 0 0;
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #475569;
  animation: rise 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both;
}

.hero-support {
  margin: 1.25rem 0 0;
  max-width: 34rem;
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  line-height: 1.55;
  color: #334155;
  font-weight: 500;
  animation: rise 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  animation: rise 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both;
}

.btn-primary {
  min-width: 148px;
  height: 52px;
  padding: 0 1.5rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  box-shadow: 0 8px 22px rgba(22, 163, 74, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(22, 163, 74, 0.35);
  filter: brightness(1.04);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  background: transparent;
  color: #166534;
  font: inherit;
  font-weight: 700;
  font-size: 0.98rem;
  cursor: pointer;
  padding: 0.75rem 0.5rem;
  transition: color 0.2s ease, transform 0.2s ease;
}

.btn-ghost:hover {
  color: #14532d;
  transform: translateY(1px);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseSoft {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.features {
  max-width: 920px;
  margin: 0 auto;
  padding: 5rem 1.5rem 3rem;
  scroll-margin-top: 1.5rem;
}

.section-title {
  margin: 0;
  text-align: center;
  font-size: clamp(1.75rem, 4vw, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #14532d;
}

.section-support {
  margin: 0.75rem auto 2.75rem;
  max-width: 32rem;
  text-align: center;
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.55;
}

.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.75rem;
}

.feature-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.1rem;
  align-items: start;
  opacity: 0;
  animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #fff;
}

.accent-green .feature-icon {
  background: #16a34a;
  box-shadow: 0 10px 24px rgba(22, 163, 74, 0.35);
}

.accent-yellow .feature-icon {
  background: #ca8a04;
  box-shadow: 0 10px 24px rgba(202, 138, 4, 0.35);
}

.accent-blue .feature-icon {
  background: #2563eb;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
}

.feature-item h3 {
  margin: 0.15rem 0 0.35rem;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.feature-item p {
  margin: 0;
  color: #475569;
  line-height: 1.55;
  font-size: 0.98rem;
}

.closing {
  text-align: center;
  padding: 4rem 1.5rem 5rem;
}

.closing-brand {
  margin: 0;
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.closing-copy {
  margin: 0.65rem 0 1.5rem;
  color: #334155;
  font-size: 1.1rem;
  font-weight: 500;
}

.footer {
  text-align: center;
  padding: 0 1.5rem 2rem;
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 500;
}

@media (max-width: 600px) {
  .nav {
    padding: 1rem 1.1rem;
  }

  .hero {
    min-height: calc(100vh - 72px);
    padding-top: 1.25rem;
  }

  .hero-mark {
    border-radius: 28px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary {
    width: 100%;
  }

  .feature-item {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
  }
}
</style>
