
export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export interface WorkflowNode {
  id: string;
  name: string;
  assignee?: string;
  completedAt?: string;
  status: WorkflowStatus;
}

export interface WorkflowItem {
  id: string;
  scriptId: string;
  creationTime: string;
  channel: string;
  relatedScript: string;
  language: string;
  nodes: {
    scripting: WorkflowNode;
    translation: WorkflowNode;
    voiceover: WorkflowNode;
    editing: WorkflowNode;
    publish: WorkflowNode;
  };
}

export interface ChannelConfig {
  channelName: string;
  expectedTimes: {
    [nodeKey: string]: string; // format "HH:mm"
  };
}

export const NODE_KEYS = [
  'scripting',
  'translation',
  'englishTranslation',
  'minorLanguageTranslation',
  'voiceover',
  'editing',
  'publish'
] as const;

export type NodeKey = typeof NODE_KEYS[number];

export const NODE_LABELS: Record<NodeKey, string> = {
  scripting: '初稿',
  translation: '翻译',
  englishTranslation: '英语翻译',
  minorLanguageTranslation: '小语种翻译',
  voiceover: '配音',
  editing: '剪辑',
  publish: '预计发布'
};
