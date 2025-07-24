const useRun = () => {
  return function (fn: () => void) {
    fn();
  };
};
const useEffectCleanupRegister = useRun;

export default useEffectCleanupRegister;
