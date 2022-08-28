import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

type MethodType = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

type MakeRequestType = {
  url: string;
  method: MethodType;
  body?: any;
  loadingText: string;
  errorText: string;
  successText: string;
  setPending?: Dispatch<SetStateAction<boolean>>;
  fnAfterSuccess?: () => void;
  fnAfterError?: () => void;
};

const makeRequest = async ({
  url,
  method,
  body = {},
  loadingText,
  errorText,
  successText,
  setPending,
  fnAfterSuccess = () => {},
  fnAfterError = () => {},
}: MakeRequestType) => {
  const deleteToastId = toast.loading(loadingText);
  setPending && setPending(true);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      toast.error(errorText, {
        id: deleteToastId,
      });
      fnAfterError();
      setPending && setPending(false);
    } else {
      toast.success(successText, {
        id: deleteToastId,
      });
      fnAfterSuccess();
      setPending && setPending(false);
    }
  } catch (err) {
    toast.error(errorText, {
      id: deleteToastId,
    });
    // console.error(err);
    fnAfterError();
    setPending && setPending(false);
  }
};

export default makeRequest;
