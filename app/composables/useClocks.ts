export function useClocks() {
  const london = ref("--:--");
  const tokyo = ref("--:--");
  const nyc = ref("--:--");

  function fmt(tz: string) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: tz,
    }).format(new Date());
  }

  function tick() {
    london.value = fmt("Europe/London");
    tokyo.value = fmt("Asia/Tokyo");
    nyc.value = fmt("America/New_York");
  }

  onMounted(() => {
    tick();
    const id = setInterval(tick, 30_000);
    onBeforeUnmount(() => clearInterval(id));
  });

  return { london, tokyo, nyc };
}
