import React, { useState } from 'react';
import { useStore, UserRole } from './lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Leaf, LogOut, Package, ShoppingCart, TrendingUp, AlertCircle, History, Hammer, LayoutDashboard } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast, Toaster } from 'sonner';

// --- AUTH COMPONENTS ---

const LoginPage = () => {
  const setUser = useStore((state) => state.setUser);
  const addLog = useStore((state) => state.addLog);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0].toUpperCase(),
      role,
    };
    setUser(newUser);
    addLog(`Connexion réussie: ${newUser.name} (${role})`);
    toast.success(`Bienvenue, ${newUser.name}!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f4] p-4">
      <Card className="w-full max-w-md border-t-4 border-green-600">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Leaf className="text-green-600 w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">SMARTBRAISE RDC</CardTitle>
          <p className="text-slate-500">Gérez votre énergie écologique</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Identifiant</Label>
              <Input 
                id="email" 
                type="text" 
                placeholder="Ex: admin@smartbraise.cd" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Rôle (Simulé)</Label>
              <Select value={role} onValueChange={(val: UserRole) => setRole(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Se connecter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// --- CLIENT COMPONENTS ---

const ClientDashboard = () => {
  const { user, logout, addOrder, orders } = useStore();
  const [bags, setBags] = useState(1);
  const [weight, setWeight] = useState<'10kg' | '25kg' | '50kg'>('10kg');
  const [type, setType] = useState<'Livraison' | 'Retrait'>('Retrait');

  const prices = { '10kg': 5, '25kg': 12, '50kg': 22 };
  const totalPrice = bags * prices[weight];
  const [deposit, setDeposit] = useState(totalPrice / 2);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    addOrder({
      id: `CMD-${Math.floor(Math.random() * 10000)}`,
      clientId: user.id,
      clientName: user.name,
      bags,
      weight,
      type,
      date: new Date().toISOString().split('T')[0],
      totalPrice,
      deposit,
      status: deposit >= totalPrice ? 'Payé' : 'Partiellement payé',
      createdAt: new Date().toISOString(),
    });
    toast.success("Commande enregistrée avec succès!");
  };

  const clientOrders = orders.filter(o => o.clientId === user?.id);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Leaf className="text-green-600" />
          <h1 className="font-bold text-lg">SmartBraise Client</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}><LogOut className="w-5 h-5" /></Button>
      </header>

      <main className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="relative h-40 rounded-xl overflow-hidden mb-6">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/51626f16-a762-48d8-b861-80a37469e4b1/charcoal-product-10kg-67c85488-1780356491300.webp" 
            alt="Product" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-4">
            <h2 className="text-white font-bold text-xl">Braise Écologique Premium</h2>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Passer une commande</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Taille du sac</Label>
                  <Select value={weight} onValueChange={(val: any) => setWeight(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10kg">10kg ($5)</SelectItem>
                      <SelectItem value="25kg">25kg ($12)</SelectItem>
                      <SelectItem value="50kg">50kg ($22)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantité</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={bags} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBags(val);
                      setDeposit(val * prices[weight] / 2);
                    }} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type de service</Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant={type === 'Retrait' ? 'default' : 'outline'} 
                    className="flex-1"
                    onClick={() => setType('Retrait')}
                  >Retrait</Button>
                  <Button 
                    type="button" 
                    variant={type === 'Livraison' ? 'default' : 'outline'} 
                    className="flex-1"
                    onClick={() => setType('Livraison')}
                  >Livraison</Button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Total à payer:</span>
                  <span className="text-green-700">${totalPrice}</span>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Acompte versé ($)</Label>
                  <Input 
                    type="number" 
                    max={totalPrice}
                    value={deposit} 
                    onChange={(e) => setDeposit(parseFloat(e.target.value))} 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Confirmer la commande</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">Mes Commandes Récentes</h3>
          {clientOrders.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">Aucune commande pour le moment.</p>
          ) : (
            clientOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">{order.id}</p>
                    <p className="font-bold">{order.bags} sacs de {order.weight}</p>
                    <p className="text-xs text-slate-500">{order.type} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={order.status === 'Livré' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="bg-slate-50 px-4 py-2 flex justify-between text-sm">
                  <span className="text-slate-500">Total: ${order.totalPrice}</span>
                  <span className="font-bold text-green-700">Reste: ${order.totalPrice - order.deposit}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

// --- ADMIN COMPONENTS ---

const AdminDashboard = () => {
  const { user, logout, orders, stocks, logs, updateOrder, updateStock, addLog } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    revenue: orders.reduce((acc, curr) => acc + curr.deposit, 0),
    pending: orders.filter(o => o.status === 'En attente' || o.status === 'Partiellement payé').length,
    criticalStock: stocks.filter(s => s.quantity < s.threshold).length
  };

  const salesData = [
    { name: 'Lun', sales: 400 },
    { name: 'Mar', sales: 300 },
    { name: 'Mer', sales: 600 },
    { name: 'Jeu', sales: 800 },
    { name: 'Ven', sales: 500 },
    { name: 'Sam', sales: 900 },
    { name: 'Dim', sales: 700 },
  ];

  const handleStatusChange = (id: string, status: any) => {
    updateOrder(id, { status });
    toast.success(`Statut mis à jour : ${status}`);
    addLog(`Statut de la commande ${id} changé en ${status}`);
  };

  const handleProduction = () => {
    // Basic production logic: 10kg wood + 1 bag = 1 bag of 10kg
    const wood = stocks.find(s => s.id === 'mat-wood');
    const bags = stocks.find(s => s.id === 'mat-bags');
    
    if (wood && wood.quantity >= 10 && bags && bags.quantity >= 1) {
      updateStock('mat-wood', -10);
      updateStock('mat-bags', -1);
      updateStock('charcoal-10', 1);
      addLog("Production: 1 sac de 10kg produit");
      toast.success("Production réussie!");
    } else {
      toast.error("Matières premières insuffisantes!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <Leaf className="text-green-500" />
          <span className="font-bold text-xl">SMARTBRAISE</span>
        </div>
        <nav className="space-y-2 flex-1">
          <Button 
            variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button 
            variant={activeTab === 'orders' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="w-4 h-4" /> Commandes
          </Button>
          <Button 
            variant={activeTab === 'stock' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab('stock')}
          >
            <Package className="w-4 h-4" /> Stocks
          </Button>
          <Button 
            variant={activeTab === 'production' ? 'secondary' : 'ghost'} 
            className="w-full justify-start gap-2"
            onClick={() => setActiveTab('production')}
          >
            <Hammer className="w-4 h-4" /> Production
          </Button>
        </nav>
        <Button variant="ghost" className="justify-start gap-2 text-slate-400" onClick={logout}>
          <LogOut className="w-4 h-4" /> Déconnexion
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Bonjour, {user?.name}</h2>
            <p className="text-slate-500">Voici l'état de votre activité aujourd'hui</p>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={logout}><LogOut className="w-5 h-5" /></Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-green-700">${stats.revenue}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="text-green-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Commandes en attente</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.pending}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg"><ShoppingCart className="text-blue-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.criticalStock > 0 ? "border-red-200 bg-red-50" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Stocks critiques</p>
                  <p className={`text-2xl font-bold ${stats.criticalStock > 0 ? "text-red-700" : "text-slate-700"}`}>
                    {stats.criticalStock}
                  </p>
                </div>
                <div className={`${stats.criticalStock > 0 ? "bg-red-100" : "bg-slate-100"} p-2 rounded-lg`}>
                  <Package className={stats.criticalStock > 0 ? "text-red-600" : "text-slate-600"} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Dashboard</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">Commandes</TabsTrigger>
              <TabsTrigger value="stock" className="flex-1">Stock</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle className="text-lg">Évolution des ventes</CardTitle></CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Journal d'activités</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-3 text-sm border-b pb-3 border-slate-100">
                      <div className="bg-slate-100 p-1.5 h-fit rounded flex-shrink-0"><History className="w-3 h-3 text-slate-500" /></div>
                      <div>
                        <p className="font-medium text-slate-800">{log.action}</p>
                        <p className="text-xs text-slate-400">{log.userName} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardHeader><CardTitle>Gestion des Commandes</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.clientName}</TableCell>
                        <TableCell>{order.bags}x {order.weight}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <p>${order.deposit} payé</p>
                            <p className="text-slate-400">Total: ${order.totalPrice}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Livré' ? 'default' : 'secondary'}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select onValueChange={(val) => handleStatusChange(order.id, val)}>
                            <SelectTrigger className="w-24 h-8 text-xs"><SelectValue placeholder="Action" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="En préparation">Préparer</SelectItem>
                              <SelectItem value="Livré">Livrer</SelectItem>
                              <SelectItem value="Annulé">Annuler</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'stock' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Stock Braises</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stocks.filter(s => s.type === 'PRODUCT').map((s) => (
                    <div key={s.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{s.name}</span>
                        <span className={s.quantity < s.threshold ? "text-red-600 font-bold" : ""}>
                          {s.quantity} {s.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${s.quantity < s.threshold ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (s.quantity / 50) * 100)}%` }}
                        ></div>
                      </div>
                      {s.quantity < s.threshold && (
                        <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3" /> STOCK CRITIQUE
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Matières Premières</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stocks.filter(s => s.type === 'MATERIAL').map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-slate-400">Seuil: {s.threshold} {s.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-700">{s.quantity} {s.unit}</p>
                        <Badge variant="outline" className="text-[10px]" onClick={() => updateStock(s.id, 50)}>+ Réappro.</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'production' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="text-green-600" /> Unité de Production
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Règle de conversion</AlertTitle>
                  <AlertDescription>
                    Production d'un sac de 10kg nécessite : 10kg de Bois + 1 Sac Écologique.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm">Disponibilité actuelle :</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-slate-500">Bois</p>
                      <p className="text-lg font-bold">{stocks.find(s => s.id === 'mat-wood')?.quantity} kg</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-slate-500">Sacs Vides</p>
                      <p className="text-lg font-bold">{stocks.find(s => s.id === 'mat-bags')?.quantity} unités</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg bg-green-700 hover:bg-green-800" onClick={handleProduction}>
                  Lancer la production (1 sac)
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

function App() {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      {user.role === 'ADMIN' ? <AdminDashboard /> : <ClientDashboard />}
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;