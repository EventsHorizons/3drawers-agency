<script setup lang="ts">
const { site } = useSiteContent();
const c = site.contact;
const status = ref<"idle" | "invalid" | "demo">("idle");
const errors = reactive<Record<string, string>>({});

function validate(fd: FormData) {
  const next: Record<string, string> = {};
  const first = String(fd.get("firstname") || "").trim();
  const last = String(fd.get("lastname") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const message = String(fd.get("message") || "").trim();
  if (first.length < 1) next.firstname = "Required";
  if (last.length < 1) next.lastname = "Required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
  if (message.length < 10) next.message = "Please write a longer message";
  return next;
}

function onSubmit(e: Event) {
  e.preventDefault();
  const fd = new FormData(e.target as HTMLFormElement);
  const next = validate(fd);
  Object.keys(errors).forEach((k) => delete errors[k]);
  Object.assign(errors, next);
  if (Object.keys(next).length) {
    status.value = "invalid";
    return;
  }
  // No live endpoint in reconstruction — do not fake delivery.
  status.value = "demo";
}

useHead({ title: "Contact | monopo london" });
</script>

<template>
  <main id="main" class="contact">
    <header class="hero">
      <h1>{{ c.formTitle || "Let’s make your project a reality" }}</h1>
      <p>{{ c.intro || c.formParagraph }}</p>
    </header>

    <section class="body">
      <aside>
        <p>
          <a :href="c.emailUrl">{{ c.email }} →</a>
        </p>
        <p class="addr">{{ c.address }}</p>
        <p v-if="c.mapsUrl">
          <a :href="c.mapsUrl" target="_blank" rel="noreferrer">
            {{ c.mapsLabel }} ↗
          </a>
        </p>

        <div class="side-block">
          <h2>{{ c.careersTitle }}</h2>
          <p>{{ c.careersParagraph }}</p>
        </div>
        <div class="side-block">
          <h2>{{ c.freelanceTitle }}</h2>
          <p>{{ c.freelanceParagraph }}</p>
        </div>
      </aside>

      <form novalidate @submit="onSubmit">
        <label>
          First name
          <input name="firstname" autocomplete="given-name" required />
          <small v-if="errors.firstname">{{ errors.firstname }}</small>
        </label>
        <label>
          Last name
          <input name="lastname" autocomplete="family-name" required />
          <small v-if="errors.lastname">{{ errors.lastname }}</small>
        </label>
        <label>
          Email
          <input name="email" type="email" autocomplete="email" required />
          <small v-if="errors.email">{{ errors.email }}</small>
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autocomplete="tel" />
        </label>
        <label>
          Message
          <textarea name="message" rows="6" required />
          <small v-if="errors.message">{{ errors.message }}</small>
        </label>
        <button type="submit">SUBMIT →</button>
        <p v-if="status === 'demo'" class="notice" role="status">
          Reconstruction mode: form validated locally. No backend endpoint is
          wired — nothing was sent to Monopo.
        </p>
        <p v-if="status === 'invalid'" class="err" role="alert">
          Please fix the highlighted fields.
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.contact {
  background: #f4f2ec;
  color: #111;
  min-height: 100vh;
}
.hero {
  padding: 4rem var(--gutter) 2rem;
}
h1 {
  margin: 0;
  max-width: 16ch;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  letter-spacing: -0.04em;
}
.hero p {
  max-width: 36rem;
  margin-top: 1rem;
  color: #555;
}
.body {
  display: grid;
  gap: 2.5rem;
  padding: 2rem var(--gutter) 4rem;
}
.addr {
  color: #666;
  white-space: pre-line;
}
aside a {
  text-decoration: underline;
}
.side-block {
  margin-top: 2rem;
}
.side-block h2 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}
.side-block p {
  color: #666;
  white-space: pre-line;
  line-height: 1.5;
  font-size: 0.92rem;
}
form {
  display: grid;
  gap: 1rem;
  max-width: 36rem;
}
label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
}
input,
textarea {
  border: 1px solid #bbb;
  background: transparent;
  color: #111;
  padding: 0.75rem;
  font: inherit;
  text-transform: none;
  letter-spacing: 0;
}
button {
  justify-self: start;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  border-radius: 999px;
  padding: 0.7rem 1.2rem;
  letter-spacing: 0.08em;
}
small,
.err {
  color: #b33;
  text-transform: none;
  letter-spacing: 0;
}
.notice {
  border: 1px solid #b8894a;
  background: #f7ecda;
  padding: 0.75rem 1rem;
  text-transform: none;
  letter-spacing: 0;
}
@media (min-width: 900px) {
  .body {
    grid-template-columns: 0.85fr 1.15fr;
  }
}
</style>
