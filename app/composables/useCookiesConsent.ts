export function useCookiesConsent() {
  const accepted = useState<boolean | null>("cookies-accepted", () => null);

  onMounted(() => {
    const raw = localStorage.getItem("3drawers-agency-cookies");
    if (raw === "1") accepted.value = true;
    if (raw === "0") accepted.value = false;
  });

  function accept() {
    accepted.value = true;
    localStorage.setItem("3drawers-agency-cookies", "1");
  }

  function dismiss() {
    accepted.value = false;
    localStorage.setItem("3drawers-agency-cookies", "0");
  }

  return { accepted, accept, dismiss };
}
