export function useCookiesConsent() {
  const accepted = useState<boolean | null>("cookies-accepted", () => null);

  onMounted(() => {
    const raw = localStorage.getItem("monopo-london-recon-cookies");
    if (raw === "1") accepted.value = true;
    if (raw === "0") accepted.value = false;
  });

  function accept() {
    accepted.value = true;
    localStorage.setItem("monopo-london-recon-cookies", "1");
  }

  function dismiss() {
    accepted.value = false;
    localStorage.setItem("monopo-london-recon-cookies", "0");
  }

  return { accepted, accept, dismiss };
}
