import { Button, Input } from '@org/ui-components';

export function App() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Lumos UI</h1>
      <div className="space-y-2">
        <Button variant="default">Default Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      <div className="space-y-2">
        <Input placeholder="Type something..." />
      </div>
    </div>
  );
}

export default App;
