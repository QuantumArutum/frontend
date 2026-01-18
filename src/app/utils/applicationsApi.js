// 应用配置API
export const getApplicationsConfig = () => {
  try {
    const savedApps = localStorage.getItem('quantaureum_applications');
    if (savedApps) {
      return JSON.parse(savedApps);
    }
    return [];
  } catch (error) {
    console.error('获取应用配置失败:', error);
    return [];
  }
};

// 获取可见的应用
export const getVisibleApplications = () => {
  const allApps = getApplicationsConfig();
  return allApps.filter((app) => app.visible);
};

// 更新应用配置
export const updateApplicationConfig = (appId, updates) => {
  try {
    const allApps = getApplicationsConfig();
    const updatedApps = allApps.map((app) => (app.id === appId ? { ...app, ...updates } : app));
    localStorage.setItem('quantaureum_applications', JSON.stringify(updatedApps));
    return true;
  } catch (error) {
    console.error('更新应用配置失败:', error);
    return false;
  }
};
