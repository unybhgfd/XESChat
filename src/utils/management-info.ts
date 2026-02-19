import { viewProject } from "./xes/project.ts";

export async function getAnnouncement(): Promise<string> {
    try {
        const projectId = 64160145; // 懒得搞其他的, 直接硬编码
        return await eval((await viewProject(projectId)).data.xml);
    } catch {
        return "加载失败! 请联系可爱的lxz";
    }
}

export async function getBlacklist(): Promise<number[]> {
    try {
        const projectId = 67033362; // 懒得搞其他的, 直接硬编码
        return await eval((await viewProject(projectId)).data.xml);
    } catch {
        return [];
    }
}
