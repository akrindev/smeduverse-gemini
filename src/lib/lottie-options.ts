import success from "../assets/success.json";
import error from "../assets/error.json";
import { Options } from "react-lottie";

// Lottie options for animations
export const errorOptions: Options = {
  loop: true,
  autoplay: true,
  animationData: error,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const successOptions: Options = {
  loop: true,
  autoplay: true,
  animationData: success,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
