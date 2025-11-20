/**
 * Zustand Test Page
 *
 * Interactive demonstration of all Zustand store features:
 * - API data management (users, posts)
 * - UI state (theme, sidebar, modals, notifications)
 * - Task management (CRUD operations, filtering, sorting)
 * - Work propagation (no props drilling, direct state subscription)
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useUsers,
  useTasks,
  useApiActions,
  useUiActions,
  useTaskActions,
  useTheme,
  useSidebar,
  useNotifications,
  useApiLoading,
  useCurrentWork,
  useWorkHistory,
  useWorkLogs,
  useIsWorkInProgress,
  useWorkflowActions,
  useTaskFilter,
  useSortBy,
  useModal,
  type Task,
  type User,
  type WorkLog,
} from '@/stores'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/zustand-test')({
  component: ZustandTestPage,
})

function ZustandTestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Header />
        <div className="grid gap-8 lg:grid-cols-2">
          <ApiSection />
          <UiSection />
        </div>
        <TaskSection />
        <WorkPropagationSection />
        <NotificationDisplay />
        <ModalDemo />
      </div>
    </div>
  )
}

function Header() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-foreground">
        {t('pages.zustandTest.title')}
      </h1>
      <p className="text-muted-foreground">
        {t('pages.zustandTest.description')}
      </p>
    </div>
  )
}

// ============================================================================
// API Section - Test API data management
// ============================================================================

function ApiSection() {
  const { t } = useTranslation()
  const users = useUsers()
  const isLoading = useApiLoading()
  const { fetchUsers, addUser, removeUser, updateUser } = useApiActions()
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')

  const handleAddUser = () => {
    if (newUserName && newUserEmail) {
      addUser({
        name: newUserName,
        email: newUserEmail,
        role: 'user',
      })
      setNewUserName('')
      setNewUserEmail('')
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
        {t('pages.zustandTest.apiSection.title')}
      </h2>

      <div className="space-y-4">
        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className={cn(
            "rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? t('pages.zustandTest.apiSection.loading') : t('pages.zustandTest.apiSection.fetchUsers')}
        </button>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">{t('pages.zustandTest.apiSection.addNewUser')}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder={t('pages.zustandTest.apiSection.namePlaceholder')}
              className="flex-1 rounded border border-input bg-background px-3 py-2 text-foreground"
            />
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder={t('pages.zustandTest.apiSection.emailPlaceholder')}
              className="flex-1 rounded border border-input bg-background px-3 py-2 text-foreground"
            />
            <button
              onClick={handleAddUser}
              className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
            >
              {t('pages.zustandTest.apiSection.add')}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">{t('pages.zustandTest.apiSection.usersCount', { count: users.length })}</h3>
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-muted-foreground">{t('pages.zustandTest.apiSection.noUsers')}</p>
            ) : (
              users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onRemove={removeUser}
                  onUpdate={updateUser}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function UserCard({
  user,
  onRemove,
  onUpdate,
}: {
  user: User
  onRemove: (id: number) => void
  onUpdate: (id: number, updates: Partial<User>) => void
}) {
  const { t } = useTranslation()
  const roles: User['role'][] = ['admin', 'user', 'guest']

  return (
    <div className="flex items-center justify-between rounded border border-border bg-background p-3">
      <div>
        <p className="font-medium text-foreground">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex gap-2">
        <select
          value={user.role}
          onChange={(e) => onUpdate(user.id, { role: e.target.value as User['role'] })}
          className="rounded border border-input bg-background px-2 py-1 text-sm text-foreground"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          onClick={() => onRemove(user.id)}
          className="rounded bg-destructive px-3 py-1 text-destructive-foreground hover:bg-destructive/90"
        >
          {t('pages.zustandTest.apiSection.remove')}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// UI Section - Test UI state management
// ============================================================================

function UiSection() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isSidebarOpen = useSidebar()
  const { toggleSidebar, setTheme, setLanguage, openModal, addNotification } = useUiActions()

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
        {t('pages.zustandTest.uiSection.title')}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.uiSection.themeControl')}</h3>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={cn(
                  "rounded px-4 py-2 capitalize transition-colors",
                  theme === themeOption
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {t(`theme.${themeOption}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.uiSection.sidebarControl')}</h3>
          <button
            onClick={toggleSidebar}
            className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            {t('pages.zustandTest.uiSection.sidebarIs', { state: isSidebarOpen ? t('pages.zustandTest.uiSection.open') : t('pages.zustandTest.uiSection.closed') })}
          </button>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.uiSection.language')}</h3>
          <div className="flex gap-2">
            {(['en', 'ko', 'ja'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="rounded bg-secondary px-4 py-2 uppercase text-secondary-foreground hover:bg-secondary/90"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.uiSection.modal')}</h3>
          <button
            onClick={() => openModal(t('pages.zustandTest.uiSection.modalTitle'), t('pages.zustandTest.uiSection.modalContent'))}
            className="rounded bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            {t('pages.zustandTest.uiSection.openModal')}
          </button>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.uiSection.notifications')}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.infoNotification'), 'info')}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              {t('pages.zustandTest.uiSection.info')}
            </button>
            <button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.successNotification'), 'success')}
              className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
            >
              {t('pages.zustandTest.uiSection.success')}
            </button>
            <button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.warningNotification'), 'warning')}
              className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
            >
              {t('pages.zustandTest.uiSection.warning')}
            </button>
            <button
              onClick={() => addNotification(t('pages.zustandTest.uiSection.errorNotification'), 'error')}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              {t('pages.zustandTest.uiSection.error')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// Task Section - Test task management
// ============================================================================

function TaskSection() {
  const { t } = useTranslation()
  const tasks = useTasks()
  const filter = useTaskFilter()
  const sortBy = useSortBy()
  const { addTask, deleteTask, setTaskStatus, setFilter, setSortBy } = useTaskActions()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')

  const handleAddTask = () => {
    if (newTaskTitle) {
      addTask({
        title: newTaskTitle,
        description: t('pages.zustandTest.taskSection.taskDescription'),
        status: 'pending',
        priority: newTaskPriority,
      })
      setNewTaskTitle('')
    }
  }

  const filterLabels: Record<string, string> = {
    all: t('pages.zustandTest.taskSection.all'),
    pending: t('pages.zustandTest.taskSection.pending'),
    in_progress: t('pages.zustandTest.taskSection.inProgress'),
    completed: t('pages.zustandTest.taskSection.completed'),
  }

  const sortLabels: Record<string, string> = {
    createdAt: t('pages.zustandTest.taskSection.created'),
    dueDate: t('pages.zustandTest.taskSection.dueDate'),
    priority: t('pages.zustandTest.taskSection.priority'),
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
        {t('pages.zustandTest.taskSection.title')}
      </h2>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.taskSection.filter')}</h3>
            <div className="flex gap-2">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded px-3 py-1 capitalize transition-colors",
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {filterLabels[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.taskSection.sortBy')}</h3>
            <div className="flex gap-2">
              {(['createdAt', 'dueDate', 'priority'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    "rounded px-3 py-1 capitalize transition-colors",
                    sortBy === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {sortLabels[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.taskSection.addNewTask')}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder={t('pages.zustandTest.taskSection.taskTitlePlaceholder')}
              className="flex-1 rounded border border-input bg-background px-3 py-2 text-foreground"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              className="rounded border border-input bg-background px-3 py-2 text-foreground"
            >
              <option value="low">{t('pages.zustandTest.taskSection.low')}</option>
              <option value="medium">{t('pages.zustandTest.taskSection.medium')}</option>
              <option value="high">{t('pages.zustandTest.taskSection.high')}</option>
            </select>
            <button
              onClick={handleAddTask}
              className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              {t('pages.zustandTest.taskSection.addTask')}
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">{t('pages.zustandTest.taskSection.tasksCount', { count: tasks.length })}</h3>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground">{t('pages.zustandTest.taskSection.noTasks')}</p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onStatusChange={setTaskStatus}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function TaskCard({
  task,
  onDelete,
  onStatusChange,
}: {
  task: Task
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: Task['status']) => void
}) {
  const { t } = useTranslation()
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  const priorityColors = {
    low: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    high: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
  }

  return (
    <div className="flex items-center justify-between rounded border border-border bg-background p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{task.title}</p>
          <span className={cn("rounded px-2 py-0.5 text-xs font-medium", priorityColors[task.priority])}>
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className={cn("rounded px-2 py-1 text-xs font-medium", statusColors[task.status])}
        >
          <option value="pending">{t('pages.zustandTest.taskSection.pending')}</option>
          <option value="in_progress">{t('pages.zustandTest.taskSection.inProgress')}</option>
          <option value="completed">{t('pages.zustandTest.taskSection.completed')}</option>
          <option value="cancelled">{t('pages.zustandTest.taskSection.cancelled')}</option>
        </select>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded bg-destructive px-3 py-1 text-destructive-foreground hover:bg-destructive/90"
        >
          {t('common.delete')}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Work Propagation Section - Demonstrates no props drilling
// ============================================================================

/**
 * Work Propagation Demonstration
 *
 * Shows how Zustand eliminates props drilling by allowing any component
 * at any depth to directly subscribe to state changes.
 *
 * Component hierarchy:
 * WorkPropagationSection
 *   ├─ WorkflowControls (subscribes to isWorkInProgress, actions)
 *   ├─ ComponentLevel1 (subscribes to currentWork)
 *   │   └─ ComponentLevel2 (subscribes to workLogs)
 *   │       └─ ComponentLevel3 (subscribes to workHistory)
 *   │           └─ ComponentLevel4 (subscribes to isWorkInProgress)
 *   └─ WorkflowLogs (subscribes to workLogs)
 *
 * Key Points:
 * - No props passed between components
 * - Each component subscribes to only what it needs
 * - State changes propagate automatically via Zustand
 * - No Context API or event bus required
 */
function WorkPropagationSection() {
  const { t } = useTranslation()

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-card-foreground">
          {t('pages.zustandTest.workSection.title')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('pages.zustandTest.workSection.description')}
        </p>
      </div>

      <div className="space-y-4">
        <WorkflowControls />
        <div className="grid gap-4 lg:grid-cols-2">
          <ComponentLevel1 />
          <WorkflowLogs />
        </div>
        <WorkHistoryDisplay />
      </div>
    </section>
  )
}

/**
 * Level 0: Workflow Controls
 * Subscribes to: isWorkInProgress, workflow actions
 * Demonstrates: Action dispatch without props
 */
function WorkflowControls() {
  const { t } = useTranslation()
  const isWorkInProgress = useIsWorkInProgress()
  const { simulateWork, cancelWork, clearHistory, clearLogs } = useWorkflowActions()
  const [workName, setWorkName] = useState('')

  const handleSimulateWork = () => {
    if (workName.trim()) {
      simulateWork(workName, 3000)
      setWorkName('')
    }
  }

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.level0.title')}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {t('pages.zustandTest.workSection.level0.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">isWorkInProgress</code>,{' '}
        <code className="rounded bg-muted px-1 py-0.5">workflowActions</code>
      </p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={workName}
            onChange={(e) => setWorkName(e.target.value)}
            placeholder={t('pages.zustandTest.workSection.level0.workNamePlaceholder')}
            disabled={isWorkInProgress}
            className="flex-1 rounded border border-input bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50"
            onKeyDown={(e) => e.key === 'Enter' && handleSimulateWork()}
          />
          <button
            onClick={handleSimulateWork}
            disabled={isWorkInProgress || !workName.trim()}
            className={cn(
              "rounded px-4 py-2 text-sm font-medium transition-colors",
              isWorkInProgress || !workName.trim()
                ? "cursor-not-allowed bg-secondary/50 text-secondary-foreground/50"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isWorkInProgress ? t('pages.zustandTest.workSection.level0.working') : t('pages.zustandTest.workSection.level0.simulateWork')}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={cancelWork}
            disabled={!isWorkInProgress}
            className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('pages.zustandTest.workSection.level0.cancelWork')}
          </button>
          <button
            onClick={clearHistory}
            className="rounded bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-secondary/90"
          >
            {t('pages.zustandTest.workSection.level0.clearHistory')}
          </button>
          <button
            onClick={clearLogs}
            className="rounded bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-secondary/90"
          >
            {t('pages.zustandTest.workSection.level0.clearLogs')}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Level 1: First nested component
 * Subscribes to: currentWork
 * Props: NONE - direct Zustand subscription
 */
function ComponentLevel1() {
  const { t } = useTranslation()
  const currentWork = useCurrentWork()

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-blue-500/30 bg-blue-500/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('pages.zustandTest.workSection.level1.title')}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('pages.zustandTest.workSection.level1.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">currentWork</code>
          <br />
          {t('pages.zustandTest.workSection.level1.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level1.none')}</code>
        </p>

        {currentWork ? (
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-foreground">{currentWork.name}</p>
              <p className="text-xs text-muted-foreground">{t('pages.zustandTest.workSection.level1.status')} {currentWork.status}</p>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>{t('pages.zustandTest.workSection.level1.progress')}</span>
                <span>{currentWork.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${currentWork.progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('pages.zustandTest.workSection.level1.noWorkInProgress')}</p>
        )}
      </div>

      <ComponentLevel2 />
    </div>
  )
}

/**
 * Level 2: Second nested component
 * Subscribes to: workLogs (first 3)
 * Props: NONE - direct Zustand subscription
 */
function ComponentLevel2() {
  const { t } = useTranslation()
  const allLogs = useWorkLogs()
  const recentLogs = allLogs.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-green-500/30 bg-green-500/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('pages.zustandTest.workSection.level2.title')}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('pages.zustandTest.workSection.level2.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">workLogs</code>
          <br />
          {t('pages.zustandTest.workSection.level2.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level2.none')}</code>
        </p>

        {recentLogs.length > 0 ? (
          <div className="space-y-1">
            {recentLogs.map((log) => (
              <LogEntry key={log.id} log={log} compact />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('pages.zustandTest.workSection.level2.noLogs')}</p>
        )}
      </div>

      <ComponentLevel3 />
    </div>
  )
}

/**
 * Level 3: Third nested component
 * Subscribes to: workHistory (count)
 * Props: NONE - direct Zustand subscription
 */
function ComponentLevel3() {
  const { t } = useTranslation()
  const workHistory = useWorkHistory()

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-purple-500/30 bg-purple-500/5 p-4">
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('pages.zustandTest.workSection.level3.title')}
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          {t('pages.zustandTest.workSection.level3.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">workHistory</code>
          <br />
          {t('pages.zustandTest.workSection.level3.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level3.none')}</code>
        </p>

        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">{workHistory.length}</div>
          <div className="text-sm text-muted-foreground">{t('pages.zustandTest.workSection.level3.completedWorks')}</div>
        </div>
      </div>

      <ComponentLevel4 />
    </div>
  )
}

/**
 * Level 4: Deepest nested component
 * Subscribes to: isWorkInProgress
 * Props: NONE - direct Zustand subscription
 * Demonstrates: Even at deep nesting, no props drilling needed!
 */
function ComponentLevel4() {
  const { t } = useTranslation()
  const isWorkInProgress = useIsWorkInProgress()

  return (
    <div className="rounded-lg border-2 border-orange-500/30 bg-orange-500/5 p-4">
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.level4.title')}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {t('pages.zustandTest.workSection.level4.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">isWorkInProgress</code>
        <br />
        {t('pages.zustandTest.workSection.level4.propsReceived')} <code className="rounded bg-muted px-1 py-0.5">{t('pages.zustandTest.workSection.level4.none')}</code>
      </p>

      <div className="flex items-center justify-center gap-2 rounded bg-background p-3">
        <div
          className={cn(
            "h-3 w-3 rounded-full transition-colors",
            isWorkInProgress ? "animate-pulse bg-green-500" : "bg-gray-400"
          )}
        />
        <span className="text-sm font-medium">
          {isWorkInProgress ? t('pages.zustandTest.workSection.level4.systemActive') : t('pages.zustandTest.workSection.level4.systemIdle')}
        </span>
      </div>
    </div>
  )
}

/**
 * Workflow Logs Display
 * Shows all logs in real-time
 */
function WorkflowLogs() {
  const { t } = useTranslation()
  const logs = useWorkLogs()

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.liveLogs', { count: logs.length })}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {t('pages.zustandTest.workSection.level2.subscribesTo')} <code className="rounded bg-muted px-1 py-0.5">workLogs</code>
      </p>

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log) => <LogEntry key={log.id} log={log} />)
        ) : (
          <p className="text-center text-sm text-muted-foreground">{t('pages.zustandTest.workSection.noLogsYet')}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Work History Display
 * Shows completed/failed works
 */
function WorkHistoryDisplay() {
  const { t } = useTranslation()
  const history = useWorkHistory()

  if (history.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {t('pages.zustandTest.workSection.workHistory', { count: history.length })}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((work) => (
          <div
            key={work.id}
            className={cn(
              "rounded border p-3",
              work.status === 'completed' && "border-green-500/50 bg-green-500/10",
              work.status === 'error' && "border-red-500/50 bg-red-500/10"
            )}
          >
            <p className="mb-1 text-sm font-medium text-foreground">{work.name}</p>
            <div className="text-xs text-muted-foreground">
              <p>{t('pages.zustandTest.workSection.level1.status')} {work.status}</p>
              {work.error && <p className="text-red-500">{t('common.error')}: {work.error}</p>}
              {work.startTime && work.endTime && (
                <p>{t('pages.zustandTest.workSection.duration', { time: ((work.endTime - work.startTime) / 1000).toFixed(2) })}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Log Entry Component
 */
function LogEntry({ log, compact = false }: { log: WorkLog; compact?: boolean }) {
  const levelColors = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  }

  const time = new Date(log.timestamp).toLocaleTimeString()

  return (
    <div className={cn("rounded bg-muted p-2", compact && "p-1.5")}>
      <div className="flex items-start gap-2">
        <span className={cn("text-xs font-medium", levelColors[log.level])}>
          [{log.level.toUpperCase()}]
        </span>
        <span className={cn("flex-1 text-xs text-foreground", compact && "text-[10px]")}>
          {log.message}
        </span>
        {!compact && <span className="text-[10px] text-muted-foreground">{time}</span>}
      </div>
    </div>
  )
}

// ============================================================================
// Notification Display - Shows notifications from UI store
// ============================================================================

function NotificationDisplay() {
  const notifications = useNotifications()
  const { removeNotification } = useUiActions()

  if (notifications.length === 0) return null

  const typeStyles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center justify-between rounded-lg px-4 py-3 shadow-lg",
            typeStyles[notification.type]
          )}
        >
          <p className="mr-4">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white hover:opacity-80"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Modal Component - Demonstrates modal from UI store
// ============================================================================

function ModalDemo() {
  const modal = useModal()
  const { closeModal } = useUiActions()

  if (!modal.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-semibold text-card-foreground">{modal.title}</h2>
        <p className="mb-4 text-muted-foreground">{modal.content}</p>
        <button
          onClick={closeModal}
          className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Close
        </button>
      </div>
    </div>
  )
}
