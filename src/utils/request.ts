export async function request(url: string, options?: RequestInit) {
  try {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: defaultOptions.headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // 如果无法解析错误响应，使用默认错误消息
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}


