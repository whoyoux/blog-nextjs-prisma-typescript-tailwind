import toast from "react-hot-toast";

type MethodType = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

type MakeRequestType = {
  url: string;
  method: MethodType;
  body?: any;
  loadingText: string;
  errorText: string;
  successText: string;
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
  fnAfterSuccess = () => {},
  fnAfterError = () => {},
}: MakeRequestType) => {
  const deleteToastId = toast.loading(loadingText);
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
    } else {
      toast.success(successText, {
        id: deleteToastId,
      });
      fnAfterSuccess();
    }
  } catch (err) {
    toast.error(errorText, {
      id: deleteToastId,
    });
    // console.error(err);
    fnAfterError();
  }
};

export default makeRequest;
