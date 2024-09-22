const login = async (email, password) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/login?useCookies=true",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error.message);

    return error.message;
  }
};

const register = async (email, password) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/register",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (response.status == 200) {
      return { status: 200, message: "Registration success" };
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);

    return error.message;
  }
};

export { login, register };
