export const getAttendanceStatus = (status: string): string => {
  switch (status) {
    case "h":
      return "hadir";
    case "s":
      return "sakit";
    case "i":
      return "izin";
    case "a":
      return "alpa";
    default:
      return "";
  }
};
