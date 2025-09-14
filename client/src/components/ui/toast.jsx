import * as React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import PropTypes from "prop-types";

// A simple utility to combine class names, similar to 'clsx' or 'classnames'
const cn = (...classes) => classes.filter(Boolean).join(" ");

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props} />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
ToastViewport.propTypes = {
  className: PropTypes.string,
};

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props} />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
Toast.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
};

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props} />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
ToastAction.propTypes = {
  className: PropTypes.string,
};

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}>
    <Cross2Icon className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
ToastClose.propTypes = {
  className: PropTypes.string,
};

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
ToastTitle.propTypes = {
  className: PropTypes.string,
};

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
ToastDescription.propTypes = {
  className: PropTypes.string,
};

// --- MISSING TOAST LOGIC ---

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000; // Increased delay for demonstration

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

const toast = (props) => {
  const id = genId();
  const update = (props) => dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } });
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  dispatch({ type: actionTypes.ADD_TOAST, toast: { ...props, id, open: true, dismiss } });
  return { id, dismiss, update };
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      // Depending on if we want to dismiss all or a specific toast
      // If no toastId is passed, dismiss all toasts
      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: false } : t)),
        };
      }
      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

let dispatch;

function Toaster() {
  const [state, localDispatch] = React.useReducer(reducer, { toasts: [] });
  dispatch = localDispatch;

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      const timeout = setTimeout(() => {
        dispatch({
          type: "DISMISS_TOAST",
          toastId: toast.id,
        });
      }, toast.duration || TOAST_REMOVE_DELAY);

      return () => {
        clearTimeout(timeout);
      };
    });
  }, [state.toasts]);

  return (
    (<ToastProvider>
      {state.toasts.map((toastItem) => {
        const { id, title, description, action, open, ...props } = toastItem;
        return (
          (<Toast key={id} {...props} open={open} onOpenChange={(open) => {
            if (!open) {
              dispatch({
                type: "DISMISS_TOAST",
                toastId: id,
              });
            }
          }}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}

// --- APP COMPONENT DEMO ---
function App() {
  const showToast = () => {
    toast({
      title: "Success!",
      description: "Your file has been saved.",
      variant: "default",
    });
  };

  const showDestructiveToast = () => {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      variant: "destructive",
    });
  };
  
  const showWithActionButton = () => {
    toast({
      title: "Your password has been reset.",
      description: "Would you like to log in now?",
      action: <ToastAction altText="Log In">Log In</ToastAction>,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Toast Demo</h1>
      <div className="flex space-x-4">
        <button
          onClick={showToast}
          className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Show Default Toast
        </button>
        <button
          onClick={showDestructiveToast}
          className="px-6 py-3 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          Show Destructive Toast
        </button>
        <button
          onClick={showWithActionButton}
          className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Show With Action Button
        </button>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
