import type { IClassify, VClassify } from "~/types/classify";
import type { Res } from "~/types";

/**
 * 分类数据管理
 */
export const useClassify = () => {
  // 使用全局状态管理分类数据（避免重复请求）
  const classifyList = useState<VClassify[]>(`classifyList`, () => []);

  /**
   * 获取分类列表
   */
  const getClassifyList = async (): Promise<VClassify[]> => {
    // 如果已有缓存数据，直接返回
    if (classifyList.value.length > 0) {
      return classifyList.value;
    }

    try {
      const response: Res<IClassify[]> = await $fetch(`/api/classify/get`, {
        method: `GET`,
      });

      if (response.code === 200) {
        const list = response.data?.list || [];
        classifyList.value = list;
        return list;
      } else {
        throw new Error(response.message || `获取分类失败`);
      }
    } catch (error) {
      console.error(`获取分类数据异常:`, error);
      throw error;
    }
  };

  /**
   * 根据ID获取分类名称
   */
  const getClassifyName = (id: number): string => {
    const classify = classifyList.value.find((item) => item.id === id);
    return classify?.name || `未知分类`;
  };

  /**
   * 清空分类缓存（用于数据更新后刷新）
   */
  const clearClassifyCache = () => {
    classifyList.value = [];
  };

  return {
    classifyList: readonly(classifyList),
    getClassifyList,
    getClassifyName,
    clearClassifyCache,
  };
};
