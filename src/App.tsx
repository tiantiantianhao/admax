import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  Users, 
  Star, 
  Share2, 
  BrainCircuit, 
  Wrench, 
  Settings2, 
  Bell, 
  Search, 
  RotateCcw, 
  ChevronRight,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  AlertCircle,
  LayoutDashboard,
  ArrowRight,
  Check,
  X,
  Clock,
  User,
  Hash,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_WORKFLOW_DATA, INITIAL_CHANNEL_CONFIGS } from './constants';
import { WorkflowItem, ChannelConfig, NODE_LABELS, NodeKey } from './types';

// Components
const Header = () => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium text-gray-800">运营发布</span>
      </div>
      <div className="flex items-center gap-6">
        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded px-2 py-1">
          <option>简体中文</option>
          <option>English</option>
        </select>
        <div className="relative">
          <Bell size={20} className="text-gray-400 cursor-pointer" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
          <span className="text-sm text-gray-600 font-medium">hao.tian</span>
        </div>
      </div>
    </div>
  );
};

// Sub-components for Modals
const ConfigModal = ({ configs, onClose, onSave }: { configs: ChannelConfig[], onClose: () => void, onSave: (c: ChannelConfig[]) => void }) => {
  const [localConfigs, setLocalConfigs] = useState(configs);

  // Define strictly the nodes to display according to user request
  const allowedNodes: NodeKey[] = ['scripting', 'translation', 'voiceover', 'editing', 'publish'];

  const calculateDuration = (t1: string, t2: string) => {
    if (!t1 || !t2) return null;
    const [h1, m1] = t1.split(':').map(Number);
    const [h2, m2] = t2.split(':').map(Number);
    const diffInMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diffInMinutes <= 0) return null;

    const hours = Math.floor(diffInMinutes / 60);
    const mins = diffInMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${mins}m`;
  };

  const handleTimeChange = (channelIdx: number, nodeKey: string, value: string) => {
    // Basic validation: ensure order (scripting < translation < voiceover < editing < publish)
    const allowedNodes: NodeKey[] = ['scripting', 'translation', 'voiceover', 'editing', 'publish'];
    const currentIdx = allowedNodes.indexOf(nodeKey as NodeKey);
    
    if (value) {
      const channelConfig = localConfigs[channelIdx];
      
      // Check previous nodes
      for (let i = 0; i < currentIdx; i++) {
        const prevTime = channelConfig.expectedTimes[allowedNodes[i]];
        if (prevTime && value < prevTime) {
          alert(`时间冲突：${NODE_LABELS[nodeKey as NodeKey]}的时间不能早于${NODE_LABELS[allowedNodes[i]]}(${prevTime})`);
          return;
        }
      }
      
      // Check subsequent nodes
      for (let i = currentIdx + 1; i < allowedNodes.length; i++) {
        const nextTime = channelConfig.expectedTimes[allowedNodes[i]];
        if (nextTime && value > nextTime) {
          alert(`时间冲突：${NODE_LABELS[nodeKey as NodeKey]}的时间不能晚于${NODE_LABELS[allowedNodes[i]]}(${nextTime})`);
          return;
        }
      }
    }

    const next = [...localConfigs];
    next[channelIdx] = {
      ...next[channelIdx],
      expectedTimes: {
        ...next[channelIdx].expectedTimes,
        [nodeKey]: value
      }
    };
    setLocalConfigs(next);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">节点预期时间配置</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">配置各生产环节的标准交付时间点</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 gap-6">
            {localConfigs.map((config, cIdx) => (
              <div key={config.channelName} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <User size={18} />
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-lg tracking-tight">{config.channelName}</h3>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-start gap-4 md:gap-0">
                  {allowedNodes.map((key, idx) => {
                    const nextKey = allowedNodes[idx + 1];
                    const duration = nextKey ? calculateDuration(config.expectedTimes[key], config.expectedTimes[nextKey]) : null;

                    return (
                      <React.Fragment key={key}>
                        <div className="flex-1 flex flex-col gap-2 min-w-[140px]">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-1">{NODE_LABELS[key as NodeKey]}</span>
                          <div className="relative group">
                             <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                             <input 
                               type="time" 
                               value={config.expectedTimes[key as NodeKey] || ''}
                               onChange={(e) => handleTimeChange(cIdx, key, e.target.value)}
                               className="w-full border-2 border-gray-50 rounded-xl pl-9 pr-3 py-2.5 bg-gray-50 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold text-gray-700 outline-none"
                             />
                          </div>
                        </div>
                        
                        {idx < allowedNodes.length - 1 && (
                          <div className="hidden md:flex flex-col items-center justify-center px-4 self-stretch pt-8">
                            <div className="h-px w-full border-t border-dashed border-gray-200 min-w-[32px]"></div>
                            {duration && (
                              <div className="mt-1.5 px-2 py-0.5 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-tight whitespace-nowrap">
                                {duration}
                              </div>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-400 font-bold hover:bg-gray-50 transition-all text-sm">取消</button>
          <button 
            onClick={() => onSave(localConfigs)} 
            className="px-10 py-3 rounded-xl bg-gray-900 text-white hover:bg-black font-black shadow-lg shadow-gray-200 transition-all text-sm tracking-widest uppercase"
          >
            保存全局配置
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AlertSummaryModal = ({ data, configs, isOverdue, onClose, onSelect }: { 
  data: WorkflowItem[], 
  configs: ChannelConfig[], 
  isOverdue: (item: WorkflowItem, key: string) => boolean,
  onClose: () => void,
  onSelect: (item: WorkflowItem, key: string) => void
}) => {
  const overdueList = useMemo(() => {
    const list: Array<{ item: WorkflowItem, nodeKey: string, label: string }> = [];
    data.forEach(item => {
      ['scripting', 'translation', 'voiceover', 'editing', 'publish'].forEach(nodeKey => {
         if (isOverdue(item, nodeKey)) {
            const config = configs.find(c => c.channelName === item.channel);
            const mapping: Record<string, NodeKey[]> = {
              scripting: ['scripting'],
              translation: ['englishTranslation', 'minorLanguageTranslation'],
              voiceover: ['voiceover'],
              editing: ['editing'],
              publish: ['publish']
            };
            const configKeys = mapping[nodeKey];
            const actualKey = configKeys?.find(k => config?.expectedTimes[k as NodeKey]) || configKeys[0];
            
            list.push({ 
              item, 
              nodeKey, 
              label: NODE_LABELS[actualKey as NodeKey] || nodeKey 
            });
         }
      });
    });
    return list;
  }, [data, isOverdue]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-red-900/20 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border-4 border-red-100"
      >
        <div className="p-8 bg-gradient-to-r from-red-600 to-red-500 text-white">
           <div className="flex items-center justify-between mb-2">
             <h2 className="text-2xl font-black flex items-center gap-2">
               <AlertCircle size={24} />
               异常业务进展监控
             </h2>
             <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
               <RotateCcw size={20} className="rotate-45" />
             </button>
           </div>
           <p className="text-red-100 opacity-90">当前共有 {overdueList.length} 条业务环节出现进度滞后，请立即处理。</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3 max-h-[60vh] bg-gray-50">
          {overdueList.map((alert, idx) => (
            <motion.div 
              key={`${alert.item.id}-${alert.nodeKey}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelect(alert.item, alert.nodeKey)}
              className="bg-white border-2 border-red-50 hover:border-red-200 rounded-2xl p-5 flex items-center justify-between cursor-pointer group shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 flex items-center justify-center rounded-xl text-red-600 group-hover:scale-110 transition-transform">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-lg">{alert.item.channel}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">{alert.label}</span>
                    <span className="text-gray-400 text-xs">脚本ID: {alert.item.scriptId}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-600 font-bold text-sm">负责人: {alert.item.nodes[alert.nodeKey as keyof typeof alert.item.nodes].assignee}</div>
                <div className="text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded mt-2">进度严重滞后</div>
              </div>
            </motion.div>
          ))}
          {overdueList.length === 0 && (
            <div className="py-20 text-center text-gray-400 font-medium">暂时没有超时节点，系统运行良好 ✨</div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-center">
            <button onClick={onClose} className="bg-gray-100 text-gray-600 px-10 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all">关闭监控界面</button>
        </div>
      </motion.div>
    </div>
  );
};

const AlertDetailModal = ({ item, nodeKey, config, onClose }: { item: WorkflowItem, nodeKey: string, config?: ChannelConfig, onClose: () => void }) => {
  const node = item.nodes[nodeKey as keyof typeof item.nodes];
  const mapping: Record<string, NodeKey[]> = {
    scripting: ['scripting'],
    translation: ['englishTranslation', 'minorLanguageTranslation'],
    voiceover: ['voiceover'],
    editing: ['editing'],
    publish: ['publish']
  };
  const configKeys = mapping[nodeKey];
  const actualKey = configKeys?.find(k => config?.expectedTimes[k as NodeKey]) || configKeys[0];
  const expectedTimeStr = config?.expectedTimes[actualKey as NodeKey];
  const nodeLabel = NODE_LABELS[actualKey as NodeKey] || nodeKey;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8"
      >
        <div className="flex items-center gap-4 mb-6 text-red-600">
           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
             <AlertCircle size={28} />
           </div>
           <div>
             <h2 className="text-xl font-bold">节点超时提醒</h2>
             <p className="text-red-400 text-sm">该节点已超过预设完成时间</p>
           </div>
        </div>
        
        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">业务频道</span>
            <span className="font-bold text-gray-800">{item.channel}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">超时节点</span>
            <span className="font-bold text-red-600">{nodeLabel}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">责任人</span>
            <span className="font-bold text-gray-800">{node.assignee || '未分配'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-500">预期完成</span>
            <span className="font-bold text-blue-600 underline">今日 {expectedTimeStr}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">当前进展</span>
            <span className="font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded italic">进度滞后 - {node.status === 'in_progress' ? '进行中' : '等待开始'}</span>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col gap-2">
          <button className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">立即联系负责人提速</button>
          <button onClick={onClose} className="w-full bg-gray-100 text-gray-600 rounded-xl py-3 font-bold hover:bg-gray-200 transition-all text-sm">关闭详情</button>
        </div>
      </motion.div>
    </div>
  );
};

// Gantt Chart Node Component
const GanttTimeline = ({ 
  item, 
  configs, 
  isOverdue 
}: { 
  item: WorkflowItem, 
  configs: ChannelConfig[], 
  isOverdue: (item: WorkflowItem, key: string) => boolean 
}) => {
  const config = configs.find(c => c.channelName === item.channel);
  const startTime = 6; // 06:00
  const endTime = 22;  // 22:00
  const totalHours = endTime - startTime;

  const nodeMap: Record<string, { key: NodeKey, label: string }> = {
    scripting: { key: 'scripting', label: '稿' },
    translation: { key: 'englishTranslation', label: '译' },
    voiceover: { key: 'voiceover', label: '配' },
    editing: { key: 'editing', label: '剪' },
    publish: { key: 'publish', label: '布' },
  };

  const getPos = (timeStr?: string) => {
    if (!timeStr) return -1;
    const [h, m] = timeStr.includes(' ') ? timeStr.split(' ')[1].split(':').map(Number) : timeStr.split(':').map(Number);
    const decimal = h + m / 60;
    const pos = ((decimal - startTime) / totalHours) * 100;
    return Math.max(0, Math.min(100, pos));
  };

  const now = new Date();
  const nowPos = getPos(`${now.getHours()}:${now.getMinutes()}`);

  // Define edges based on business logic: Script -> Trans -> Voice -> Edit -> Publish
  const edges = [
    { from: 'scripting', to: 'translation' },
    { from: 'translation', to: 'voiceover' },
    { from: 'voiceover', to: 'editing' },
    { from: 'editing', to: 'publish' },
  ];

  return (
    <div 
      className="relative w-full h-12 bg-gray-50/50 rounded-lg flex items-center px-2 border border-gray-100 group/gantt"
    >
      {/* Background Grid Lines */}
      {Array.from({ length: totalHours + 1 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute top-0 bottom-0 border-l border-gray-200/50" 
          style={{ left: `${(i / totalHours) * 100}%` }}
        />
      ))}

      {/* Now Indicator */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10 opacity-50 flex flex-col items-center"
        style={{ left: `${nowPos}%` }}
      >
        <div className="text-[8px] bg-red-400 text-white px-1 rounded-sm -mt-3">NOW</div>
      </div>

      {/* Connection Lines (Corrected for branching logic) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge, idx) => {
          const fromMeta = nodeMap[edge.from];
          const toMeta = nodeMap[edge.to];
          
          const fromKey = fromMeta.key;
          const toKey = toMeta.key;

          const startX = getPos(config?.expectedTimes[fromKey]);
          const endX = getPos(config?.expectedTimes[toKey]);
          
          if (startX < 0 || endX < 0) return null;

          return (
            <line 
              key={`${edge.from}-${edge.to}`}
              x1={`${startX}%`} y1="50%" x2={`${endX}%`} y2="50%"
              stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {Object.entries(nodeMap).map(([nodeKey, meta], idx) => {
        const node = item.nodes[nodeKey as keyof typeof item.nodes];
        const overdue = isOverdue(item, nodeKey);
        const expectedTimePos = getPos(config?.expectedTimes[meta.key]);
        const completedTimePos = node.completedAt ? getPos(node.completedAt) : -1;
        const isCompleted = node.status === 'completed';

        if (expectedTimePos < 0) return null;

        return (
          <div 
            key={nodeKey}
            className="absolute group"
            style={{ left: `${expectedTimePos}%`, transform: 'translateX(-50%)' }}
          >
            {/* Expected Marker */}
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-500
              ${isCompleted ? 'bg-emerald-500 scale-110' : (overdue ? 'bg-red-500 animate-ping ring-4 ring-red-100' : 'bg-gray-300')}
            `} />
            
            {/* Label Tooltip */}
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
               <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap flex flex-col items-center">
                 <span className="font-bold">{NODE_LABELS[meta.key]}</span>
                 <span>预期: {config?.expectedTimes[meta.key]}</span>
                 {isCompleted && <span className="text-emerald-300">完成: {node.completedAt?.split(' ')[1]}</span>}
                 {overdue && <span className="text-red-300">🚨 严重超时</span>}
               </div>
            </div>

            {/* Label below */}
            <span className={`text-[9px] mt-4 block text-center font-bold
              ${isCompleted ? 'text-emerald-600' : (overdue ? 'text-red-600' : 'text-gray-400')}
            `}>
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DetailDrawer = ({ 
  item, 
  configs, 
  onClose,
  getNodeTimingStatus 
}: { 
  item: WorkflowItem, 
  configs: ChannelConfig[], 
  onClose: () => void,
  getNodeTimingStatus: (item: WorkflowItem, key: string) => string
}) => {
  const config = configs.find(c => c.channelName === item.channel);
  
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">{item.channel}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-6">
          <section>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {['scripting', 'translation', 'voiceover', 'editing', 'publish'].map(k => {
                const timingStatus = getNodeTimingStatus(item, k);
                const isOverdue = timingStatus === 'overdue';
                const isOverdueCompleted = timingStatus === 'overdue-completed';
                const node = item.nodes[k as keyof typeof item.nodes];
                const isCompleted = node?.status === 'completed';
                const nodeLabel = NODE_LABELS[k as NodeKey];
                const expectedTimeStr = config?.expectedTimes[k as NodeKey];
                
                let overdueText = '';
                if (isOverdueCompleted && node.completedAt && expectedTimeStr) {
                  const compDate = new Date(node.completedAt.replace(/-/g, '/'));
                  const [expH, expM] = expectedTimeStr.split(':').map(Number);
                  const expDate = new Date(compDate);
                  expDate.setHours(expH, expM, 0, 0);
                  
                  const diffMs = compDate.getTime() - expDate.getTime();
                  if (diffMs > 0) {
                    const diffMin = Math.floor(diffMs / 60000);
                    if (diffMin < 60) {
                      overdueText = `(+${diffMin}min)`;
                    } else {
                      const h = Math.floor(diffMin / 60);
                      const m = diffMin % 60;
                      overdueText = `(+${h}h${m}m)`;
                    }
                  }
                }

                return (
                  <div key={k} className="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-all group">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm transition-all ${
                      isOverdue ? 'bg-red-500 animate-pulse ring-2 ring-red-100' : 
                      isOverdueCompleted ? 'bg-orange-500 ring-2 ring-orange-100' :
                      (isCompleted ? 'bg-emerald-500' : (node?.status === 'in_progress' ? 'bg-gray-300' : 'bg-gray-100 border-gray-200'))
                    }`}>
                      {isCompleted && <Check size={10} className="text-white stroke-[4]" />}
                      {isOverdue && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 text-sm truncate">{nodeLabel}</div>
                      <div className="text-[10px] text-gray-400 font-medium">负责人: {node.assignee || '未分配'}</div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end w-20">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">预期</span>
                        <span className={`text-[11px] font-bold ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                          {expectedTimeStr || '--:--'}
                        </span>
                      </div>
                      <div className="flex flex-col items-end w-20">
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">实际完成</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-[11px] font-black ${isOverdueCompleted ? 'text-orange-500' : (isCompleted ? 'text-emerald-500' : 'text-gray-300')}`}>
                            {node.completedAt ? node.completedAt.split(' ')[1].substring(0, 5) : '--:--'}
                          </span>
                          {overdueText && (
                            <span className="text-[9px] font-black text-red-500 bg-red-50 px-1 rounded">{overdueText}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

const ProductionListDrawer = ({ 
  data, 
  onClose,
  onSelectChannel,
  getNodeTimingStatus,
  isOverdue
}: { 
  data: WorkflowItem[], 
  onClose: () => void,
  onSelectChannel: (item: WorkflowItem) => void,
  getNodeTimingStatus: (item: WorkflowItem, key: string) => string,
  isOverdue: (item: WorkflowItem, key: string) => boolean
}) => {
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-4xl bg-[#f8fafc] h-full shadow-2xl border-l border-gray-100 flex flex-col"
      >
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3">
             <div className="flex items-baseline gap-2">
               <h2 className="text-xl font-black text-gray-800 tracking-tight">生产监控详情</h2>
               <span className="text-sm font-bold text-gray-400">共 {data.length} 个运营频道</span>
             </div>
           </div>
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-gray-300 shadow-sm"></div>
                 <span className="text-[10px] font-bold text-gray-500">进行中</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                   <Check size={6} className="text-white stroke-[4]" />
                 </div>
                 <span className="text-[10px] font-bold text-gray-500">正常完成</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
                   <Check size={6} className="text-white stroke-[4]" />
                 </div>
                 <span className="text-[10px] font-bold text-gray-500">超时完成</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse flex items-center justify-center ring-1 ring-red-100">
                   <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                 </div>
                 <span className="text-[10px] font-bold text-gray-500">超时未完成</span>
               </div>
             </div>
           </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <tbody className="divide-y divide-gray-50">
              {data.map((item) => {
                const itemHasOverdue = Object.keys(item.nodes).some(k => isOverdue(item, k));
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => onSelectChannel(item)}
                    className={`hover:bg-blue-50/20 transition-all cursor-pointer group border-l-4 ${itemHasOverdue ? 'border-l-red-500 bg-red-50/10' : 'border-l-transparent'}`}
                  >
                    <td className="px-5 py-2.5">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-gray-800 font-extrabold text-base min-w-[180px]">{item.channel}</span>
                        
                        <div className="flex items-center gap-6 flex-1 justify-end mr-4">
                          {['scripting', 'translation', 'voiceover', 'editing', 'publish'].map(k => {
                            const timingStatus = getNodeTimingStatus(item, k);
                            const isNodOverdue = timingStatus === 'overdue';
                            const isOverdueCompleted = timingStatus === 'overdue-completed';
                            const node = item.nodes[k as keyof typeof item.nodes];
                            const isCompleted = node?.status === 'completed';
                            
                            return (
                              <div key={k} className="relative flex flex-col items-center gap-1 transition-all">
                                <div className="flex flex-col items-center gap-0.5">
                                  <div className={`w-5 h-5 rounded-full transition-all border-2 border-white shadow-sm flex items-center justify-center ${
                                    isNodOverdue ? 'bg-red-500 animate-pulse ring-2 ring-red-100' : 
                                    isOverdueCompleted ? 'bg-orange-500 ring-2 ring-orange-100' :
                                    (isCompleted ? 'bg-emerald-500' : (node.status === 'in_progress' ? 'bg-gray-300' : 'bg-gray-100 border-gray-200'))
                                  }`}>
                                    {(isCompleted || isOverdueCompleted) && <Check size={10} className="text-white stroke-[4]" />}
                                    {isNodOverdue && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                                  </div>
                                  
                                  <span className={`text-[9px] font-black uppercase tracking-tighter ${
                                    isNodOverdue ? 'text-red-600' : 
                                    isOverdueCompleted ? 'text-orange-600' :
                                    (isCompleted ? 'text-emerald-600' : 'text-gray-300')
                                  }`}>
                                    {k === 'scripting' ? '稿' : k === 'translation' ? '译' : k === 'voiceover' ? '配' : k === 'editing' ? '剪' : '布'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <ChevronRight className="text-gray-200 group-hover:text-blue-500 transition-colors" size={16} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [data] = useState<WorkflowItem[]>(MOCK_WORKFLOW_DATA);
  const [configs, setConfigs] = useState<ChannelConfig[]>(INITIAL_CHANNEL_CONFIGS);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAlertSummaryOpen, setIsAlertSummaryOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<{ item: WorkflowItem, nodeKey: string } | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<WorkflowItem | null>(null);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState(false);

  // Helper to check the status of a node relative to its deadline
  const getNodeTimingStatus = (item: WorkflowItem, nodeKey: string): 'on-track' | 'overdue' | 'overdue-completed' => {
    const node = item.nodes[nodeKey as keyof typeof item.nodes];
    if (!node) return 'on-track';

    const config = configs.find(c => c.channelName === item.channel);
    if (!config) return 'on-track';

    const mapping: Record<string, NodeKey[]> = {
      scripting: ['scripting'],
      translation: ['englishTranslation', 'minorLanguageTranslation'], 
      voiceover: ['voiceover'],
      editing: ['editing'],
      publish: ['publish']
    };

    const configKeys = mapping[nodeKey];
    if (!configKeys) return 'on-track';

    const actualKey = configKeys.find(k => config.expectedTimes[k as NodeKey]);
    if (!actualKey) return 'on-track';

    const expectedTimeStr = config.expectedTimes[actualKey as NodeKey];
    if (!expectedTimeStr) return 'on-track';

    const [hours, minutes] = expectedTimeStr.split(':').map(Number);
    const expected = new Date();
    expected.setHours(hours, minutes, 0, 0);

    // If completed, check if it was completed AFTER the deadline
    if (node.status === 'completed' && node.completedAt) {
      const completedDate = new Date(node.completedAt.replace(/-/g, '/'));
      // We only care about the time part for comparison in this simplified model
      const compTime = new Date();
      compTime.setHours(completedDate.getHours(), completedDate.getMinutes(), 0, 0);
      
      if (compTime.getTime() > expected.getTime()) {
        return 'overdue-completed';
      }
      return 'on-track';
    }

    if (node.status === 'completed') return 'on-track';

    const now = new Date();
    // Difference in milliseconds
    const diff = expected.getTime() - now.getTime();

    if (diff < 0) return 'overdue';
    return 'on-track';
  };

  const isOverdue = (item: WorkflowItem, nodeKey: string) => getNodeTimingStatus(item, nodeKey) === 'overdue';

  const overdueNodesCount = useMemo(() => {
    let count = 0;
    data.forEach(item => {
      const hasOverdue = Object.keys(item.nodes).some(nodeKey => getNodeTimingStatus(item, nodeKey) === 'overdue');
      if (hasOverdue) count++;
    });
    return count;
  }, [data, configs]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6 space-y-4">
          {/* Status Bar - Normal (Green) */}
          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-[22px] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500"></div>
            <div className="flex items-center gap-5 ml-1">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Check size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-800 tracking-tight">生产监控</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">当前进度正常</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsListDrawerOpen(true)}
              className="bg-white text-gray-600 px-4 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              查看详情
            </button>
          </div>

          {/* Status Bar - Alert (Red, only if overdue) */}
          {overdueNodesCount > 0 && (
            <div className="flex items-center justify-between bg-white px-6 py-3 rounded-[22px] border border-red-50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-red-600 animate-pulse"></div>
              <div className="flex items-center gap-5 ml-1">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <AlertCircle size={20} className="animate-bounce" />
                </div>
                <div>
                  <h2 className="text-base font-black text-gray-800 tracking-tight">生产监控</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">{overdueNodesCount}个频道超时未完成</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsListDrawerOpen(true)}
                className="bg-red-600 text-white px-4 py-1.5 rounded-xl border border-red-700 hover:bg-red-700 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100"
              >
                查看详情
              </button>
            </div>
          )}

          {/* Floating Action Button for Configuration */}
          <div className="fixed bottom-10 right-10 z-[70]">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsConfigOpen(true)}
              className="bg-gray-900 text-white group flex items-center gap-3 px-6 py-4 rounded-[28px] shadow-2xl shadow-gray-400/40 hover:bg-black transition-all border border-white/10"
            >
              <div className="p-2 bg-white/10 rounded-xl group-hover:rotate-45 transition-transform">
                <Clock size={20} />
              </div>
              <div className="flex flex-col items-start leading-none pr-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] mb-1">Duration</span>
                <span className="text-sm font-bold">时间配置</span>
              </div>
            </motion.button>
          </div>
        </main>
      </div>

      {/* Modals and Drawers (Shared) */}
      <AnimatePresence mode="wait">
        {isConfigOpen && (
          <ConfigModal 
            configs={configs} 
            onClose={() => setIsConfigOpen(false)} 
            onSave={(newConfigs) => {
              setConfigs(newConfigs);
              setIsConfigOpen(false);
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAlertSummaryOpen && (
          <AlertSummaryModal 
            data={data} 
            configs={configs} 
            isOverdue={isOverdue}
            onClose={() => setIsAlertSummaryOpen(false)}
            onSelect={(item, nodeKey) => {
              setSelectedAlert({ item, nodeKey });
              setIsAlertSummaryOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedChannel && (
          <DetailDrawer 
            item={selectedChannel}
            configs={configs}
            onClose={() => setSelectedChannel(null)}
            getNodeTimingStatus={getNodeTimingStatus}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isListDrawerOpen && (
          <ProductionListDrawer 
            data={data}
            isOverdue={isOverdue}
            getNodeTimingStatus={getNodeTimingStatus}
            onClose={() => setIsListDrawerOpen(false)}
            onSelectChannel={(item) => {
              setSelectedChannel(item);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAlert && (
          <AlertDetailModal 
            item={selectedAlert.item}
            nodeKey={selectedAlert.nodeKey}
            config={configs.find(c => c.channelName === selectedAlert.item.channel)}
            onClose={() => setSelectedAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
