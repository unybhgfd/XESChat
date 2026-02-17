import { viewProject } from "../xes/project.ts";

export async function getAnnouncement(): Promise<string> {
    const projectId = 64160145; // 懒得搞其他的, 直接硬编码
    return await eval((await viewProject(projectId)).data.xml);
}
