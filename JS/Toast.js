const success = (message) => {
  const toastOptions = {
    title: 'Success !',
    content: message,
    timeOut: 3000,
    cssClass: 'e-toast-success',
    animation: {
      hide: { effect: 'SlideRightOut' },
      show: { effect: 'SlideRightIn' }
  },
    showCloseButton: true,
    showProgressBar: true,
    progressDirection: 'Ltr',
    position: { X: 'Right', Y: 'Top' }
  };
  const toast = new ej.notifications.Toast(toastOptions);
  toast.appendTo('.Toast');
  toast.show();
};

const error = (message) => {
  const toastOptions1 = {
    title: 'Error !',
    content: message,
    timeOut: 3000,
    cssClass: 'e-toast-danger',
    animation: {
      hide: { effect: 'SlideRightOut' },
      show: { effect: 'SlideRightIn' }
  },
    showCloseButton: true,
    showProgressBar: true,
    progressDirection: 'Ltr',
    position: { X: 'Right', Y: 'Top' }
  };
  const toast = new ej.notifications.Toast(toastOptions1);
  toast.appendTo('.Toast');
  toast.show();
};

export {success, error} ;
