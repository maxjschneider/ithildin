const login = async (email, password) => {
  try {
    const response = await fetch(
      url,
      (method = "POST"),
      (headers = {
        credentials: "include",
      })
    );
  } catch (error) {}
};

export { login };
