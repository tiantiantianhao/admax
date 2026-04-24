
import { ChannelConfig, WorkflowItem } from './types';

export const INITIAL_CHANNEL_CONFIGS: ChannelConfig[] = [
  {
    channelName: '美股头等舱',
    expectedTimes: { scripting: '01:15', englishTranslation: '01:45', voiceover: '02:00', editing: '02:15', publish: '03:00' }
  },
  {
    channelName: '币研室',
    expectedTimes: { scripting: '01:20', englishTranslation: '01:40', voiceover: '01:40', editing: '02:15', publish: '03:00' }
  },
  {
    channelName: '安全运营',
    expectedTimes: { scripting: '02:15', englishTranslation: '02:45', voiceover: '03:00', editing: '03:15', publish: '03:30' }
  },
  {
    channelName: '科技前哨',
    expectedTimes: { scripting: '01:00', englishTranslation: '01:30', voiceover: '02:00', editing: '02:30', publish: '03:00' }
  },
  {
    channelName: '环球财经',
    expectedTimes: { scripting: '00:30', englishTranslation: '01:00', voiceover: '01:30', editing: '02:00', publish: '02:30' }
  }
];

export const MOCK_WORKFLOW_DATA: WorkflowItem[] = [
  {
    id: '1',
    scriptId: 'SCR-001',
    creationTime: '2026-04-23 07:00:00',
    channel: '美股头等舱',
    relatedScript: '美股盘前分析',
    language: 'cn',
    nodes: {
      scripting: { id: 's1', name: '初稿', status: 'completed', assignee: '张三', completedAt: '2026-04-23 09:45:00' },
      translation: { id: 't1', name: '翻译', status: 'completed', assignee: '李四', completedAt: '2026-04-23 10:15:00' },
      voiceover: { id: 'v1', name: '配音', status: 'in_progress', assignee: '王五' },
      editing: { id: 'e1', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p1', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '2',
    scriptId: 'SCR-002',
    creationTime: '2026-04-23 07:30:00',
    channel: '币研室',
    relatedScript: '加密货币日报',
    language: 'cn',
    nodes: {
      scripting: { id: 's2', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't2', name: '翻译', status: 'in_progress', assignee: '李四' },
      voiceover: { id: 'v2', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e2', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p2', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '3',
    scriptId: 'SCR-003',
    creationTime: '2026-04-23 08:00:00',
    channel: '安全运营',
    relatedScript: '网络安全周报',
    language: 'cn',
    nodes: {
      scripting: { id: 's3', name: '初稿', status: 'in_progress', assignee: '张三' },
      translation: { id: 't3', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v3', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e3', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p3', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '4',
    scriptId: 'SCR-004',
    creationTime: '2026-04-23 08:15:00',
    channel: '科技前哨',
    relatedScript: 'AI新趋势',
    language: 'cn',
    nodes: {
      scripting: { id: 's4', name: '初稿', status: 'completed', assignee: '张三', completedAt: '2026-04-23 03:00:00' },
      translation: { id: 't4', name: '翻译', status: 'completed', assignee: '李四', completedAt: '2026-04-23 03:20:00' },
      voiceover: { id: 'v4', name: '配音', status: 'completed', assignee: '王五', completedAt: '2026-04-23 03:30:00' },
      editing: { id: 'e4', name: '剪辑', status: 'in_progress', assignee: '赵六' },
      publish: { id: 'p4', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '5',
    scriptId: 'SCR-005',
    creationTime: '2026-04-23 08:30:00',
    channel: '环球财经',
    relatedScript: '财报季汇总',
    language: 'cn',
    nodes: {
      scripting: { id: 's5', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't5', name: '翻译', status: 'completed', assignee: '李四' },
      voiceover: { id: 'v5', name: '配音', status: 'completed', assignee: '王五' },
      editing: { id: 'e5', name: '剪辑', status: 'completed', assignee: '赵六' },
      publish: { id: 'p5', name: '发布', status: 'in_progress', assignee: '陈七' },
    }
  },
  {
    id: '6',
    scriptId: 'SCR-006',
    creationTime: '2026-04-23 09:00:00',
    channel: '深度解析',
    relatedScript: '宏观政策解读',
    language: 'cn',
    nodes: {
      scripting: { id: 's6', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't6', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v6', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e6', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p6', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '7',
    scriptId: 'SCR-007',
    creationTime: '2026-04-23 09:10:00',
    channel: '晨间快讯',
    relatedScript: '早报精选',
    language: 'cn',
    nodes: {
      scripting: { id: 's7', name: '初稿', status: 'in_progress', assignee: '张三' },
      translation: { id: 't7', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v7', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e7', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p7', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '8',
    scriptId: 'SCR-008',
    creationTime: '2026-04-23 09:20:00',
    channel: '晚间观察',
    relatedScript: '收评分析',
    language: 'cn',
    nodes: {
      scripting: { id: 's8', name: '初稿', status: 'pending', assignee: '张三' },
      translation: { id: 't8', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v8', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e8', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p8', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '9',
    scriptId: 'SCR-009',
    creationTime: '2026-04-23 09:30:00',
    channel: '行业深挖',
    relatedScript: '半导体板块',
    language: 'cn',
    nodes: {
      scripting: { id: 's9', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't9', name: '翻译', status: 'in_progress', assignee: '李四' },
      voiceover: { id: 'v9', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e9', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p9', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '10',
    scriptId: 'SCR-010',
    creationTime: '2026-04-23 09:40:00',
    channel: '市场实操',
    relatedScript: '交易策略分享',
    language: 'cn',
    nodes: {
      scripting: { id: 's10', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't10', name: '翻译', status: 'completed', assignee: '李四' },
      voiceover: { id: 'v10', name: '配音', status: 'in_progress', assignee: '王五' },
      editing: { id: 'e10', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p10', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '11',
    scriptId: 'SCR-011',
    creationTime: '2026-04-23 10:00:00',
    channel: '名师课堂',
    relatedScript: '价值投资入门',
    language: 'cn',
    nodes: {
      scripting: { id: 's11', name: '初稿', status: 'pending', assignee: '张三' },
      translation: { id: 't11', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v11', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e11', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p11', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '12',
    scriptId: 'SCR-012',
    creationTime: '2026-04-23 10:15:00',
    channel: '实时直播',
    relatedScript: '非农数据直播',
    language: 'cn',
    nodes: {
      scripting: { id: 's12', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't12', name: '翻译', status: 'completed', assignee: '李四' },
      voiceover: { id: 'v12', name: '配音', status: 'completed', assignee: '王五' },
      editing: { id: 'e12', name: '剪辑', status: 'completed', assignee: '赵六' },
      publish: { id: 'p12', name: '发布', status: 'completed', assignee: '陈七' },
    }
  },
  {
    id: '13',
    scriptId: 'SCR-013',
    creationTime: '2026-04-23 10:30:00',
    channel: '大厂访谈',
    relatedScript: '对话腾讯高管',
    language: 'cn',
    nodes: {
      scripting: { id: 's13', name: '初稿', status: 'pending', assignee: '张三' },
      translation: { id: 't13', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v13', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e13', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p13', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '14',
    scriptId: 'SCR-014',
    creationTime: '2026-04-23 10:45:00',
    channel: '冷思考',
    relatedScript: '当前泡沫评估',
    language: 'cn',
    nodes: {
      scripting: { id: 's14', name: '初稿', status: 'completed', assignee: '张三' },
      translation: { id: 't14', name: '翻译', status: 'in_progress', assignee: '李四' },
      voiceover: { id: 'v14', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e14', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p14', name: '发布', status: 'pending', assignee: '陈七' },
    }
  },
  {
    id: '15',
    scriptId: 'SCR-015',
    creationTime: '2026-04-23 11:00:00',
    channel: '周末专题',
    relatedScript: '美联储历史回顾',
    language: 'cn',
    nodes: {
      scripting: { id: 's15', name: '初稿', status: 'pending', assignee: '张三' },
      translation: { id: 't15', name: '翻译', status: 'pending', assignee: '李四' },
      voiceover: { id: 'v15', name: '配音', status: 'pending', assignee: '王五' },
      editing: { id: 'e15', name: '剪辑', status: 'pending', assignee: '赵六' },
      publish: { id: 'p15', name: '发布', status: 'pending', assignee: '陈七' },
    }
  }
];
