import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useHealthCheck,
  useItems,
  useCreateItem,
  useDeleteItem,
  useUsers,
  useLogin,
  useSearch,
} from '@/api/services'
import type { ItemCreate } from '@/mocks/schemas'

export const Route = createFileRoute('/msw-test')({
  component: MswTestPage,
})

function MswTestPage() {
  const { t } = useTranslation()

  // Health check
  const { data: healthData, isLoading: healthLoading, error: healthError, refetch: refetchHealth } = useHealthCheck()

  // Items
  const { data: itemsData, isLoading: itemsLoading, error: itemsError, refetch: refetchItems } = useItems()
  const createItemMutation = useCreateItem()
  const deleteItemMutation = useDeleteItem()

  // Users
  const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers()

  // Create item form state
  const [newItemName, setNewItemName] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')

  // Login state
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const loginMutation = useLogin()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchEnabled, setSearchEnabled] = useState(false)
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearch(
    searchEnabled ? searchQuery : ''
  )

  // Create item handler
  const handleCreateItem = () => {
    if (!newItemName || !newItemDescription || !newItemPrice) {
      alert(t('pages.mswTest.createItem.allFieldsRequired'))
      return
    }

    const itemData: ItemCreate = {
      name: newItemName,
      description: newItemDescription,
      price: Number(newItemPrice),
      category: 'Electronics',
    }

    createItemMutation.mutate(itemData, {
      onSuccess: () => {
        // Reset form
        setNewItemName('')
        setNewItemDescription('')
        setNewItemPrice('')
      },
    })
  }

  // Delete item handler
  const handleDeleteItem = (id: number) => {
    deleteItemMutation.mutate(id)
  }

  // Login handler
  const handleLogin = () => {
    loginMutation.mutate({ username, password })
  }

  // Search handler
  const handleSearch = () => {
    if (searchQuery) {
      setSearchEnabled(true)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            {t('pages.mswTest.title')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('pages.mswTest.description')}
          </p>
          <p className="mt-1 text-sm text-primary">
            {t('pages.mswTest.devToolsHint')}
          </p>
        </div>

        {/* Health Check Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.healthCheck.title')}
          </h2>
          <button
            onClick={() => refetchHealth()}
            disabled={healthLoading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {healthLoading ? t('pages.mswTest.healthCheck.loading') : t('pages.mswTest.healthCheck.button')}
          </button>
          {healthData && (
            <pre className="mt-4 overflow-x-auto rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          )}
          {healthError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              {t('common.error')}: {healthError.message}
            </div>
          )}
        </section>

        {/* Items List Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.itemsList.title')}
          </h2>
          <button
            onClick={() => refetchItems()}
            disabled={itemsLoading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {itemsLoading ? t('pages.mswTest.itemsList.loading') : t('pages.mswTest.itemsList.fetchButton')}
          </button>
          {itemsData && itemsData.items && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                {t('pages.mswTest.itemsList.total', { count: itemsData.total })}
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {itemsData.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-2 font-bold">
                      ₩{item.price.toLocaleString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={deleteItemMutation.isPending}
                        className="rounded bg-destructive px-3 py-1 text-sm text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                      >
                        {deleteItemMutation.isPending ? t('pages.mswTest.itemsList.deleting') : t('pages.mswTest.itemsList.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {itemsError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              {t('common.error')}: {itemsError.message}
            </div>
          )}
        </section>

        {/* Create Item Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.createItem.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">{t('pages.mswTest.createItem.nameLabel')}</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder={t('pages.mswTest.createItem.namePlaceholder')}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t('pages.mswTest.createItem.descriptionLabel')}
              </label>
              <input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder={t('pages.mswTest.createItem.descriptionPlaceholder')}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t('pages.mswTest.createItem.priceLabel')}</label>
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder={t('pages.mswTest.createItem.pricePlaceholder')}
              />
            </div>
            <button
              onClick={handleCreateItem}
              disabled={createItemMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createItemMutation.isPending ? t('pages.mswTest.createItem.creating') : t('pages.mswTest.createItem.button')}
            </button>
          </div>
          {createItemMutation.isSuccess && createItemMutation.data && (
            <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {t('pages.mswTest.createItem.success')}
              <pre className="mt-2 text-xs">
                {JSON.stringify(createItemMutation.data, null, 2)}
              </pre>
            </div>
          )}
          {createItemMutation.isError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              {t('common.error')}: {createItemMutation.error.message}
            </div>
          )}
        </section>

        {/* Users Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.usersList.title')}
          </h2>
          <button
            onClick={() => refetchUsers()}
            disabled={usersLoading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {usersLoading ? t('pages.mswTest.usersList.loading') : t('pages.mswTest.usersList.fetchButton')}
          </button>
          {usersData && usersData.users && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                {t('pages.mswTest.usersList.total', { count: usersData.total })}
              </p>
              <div className="space-y-2">
                {usersData.users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{user.full_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{user.username} • {user.email}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}
                      >
                        {user.is_active ? t('pages.mswTest.usersList.active') : t('pages.mswTest.usersList.inactive')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {usersError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              {t('common.error')}: {usersError.message}
            </div>
          )}
        </section>

        {/* Login Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.login.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t('pages.mswTest.login.usernameLabel')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                {t('pages.mswTest.login.passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="admin"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loginMutation.isPending ? t('pages.mswTest.login.loggingIn') : t('pages.mswTest.login.button')}
            </button>
            <p className="text-sm text-muted-foreground">
              {t('pages.mswTest.login.hint')}
            </p>
          </div>
          {loginMutation.isSuccess && loginMutation.data && (
            <div className="mt-4 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              {t('pages.mswTest.login.success')}
              <pre className="mt-2 overflow-x-auto text-xs">
                {JSON.stringify(loginMutation.data, null, 2)}
              </pre>
            </div>
          )}
          {loginMutation.isError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              {t('common.error')}: {loginMutation.error.message}
            </div>
          )}
        </section>

        {/* Search Section */}
        <section className="mb-8 rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.search.title')}
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchEnabled(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2"
              placeholder={t('pages.mswTest.search.placeholder')}
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {searchLoading ? t('pages.mswTest.search.searching') : t('pages.mswTest.search.button')}
            </button>
          </div>
          {searchData && searchData.results && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">
                {t('pages.mswTest.search.results', { count: searchData.total, query: searchData.query })}
              </p>
              <div className="space-y-2">
                {searchData.results.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 font-bold">
                      ₩{item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchError && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              {t('common.error')}: {searchError.message}
            </div>
          )}
        </section>

        {/* API Documentation */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-card-foreground">
            {t('pages.mswTest.benefits.title')}
          </h2>
          <div className="space-y-3 text-sm">
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.caching')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.refresh')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.states')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.devtools')}
            </div>
            <div className="rounded-md bg-muted p-3">
              {t('pages.mswTest.benefits.switching')}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
