export const successRequest = ({ onSuccess, file }) => {
  setTimeout(() => {
    onSuccess(null, file);
  });
};

export const errorRequest = ({ onError }) => {
  setTimeout(() => {
    onError();
  });
};

export const syncErrorRequest = ({ onError }) => {
  onError();
};
