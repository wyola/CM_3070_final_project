import { Button } from '@/components/ui/button';

export function ColorPalletee() {
  return (
    <div
      style={{
        color: '#212121',
        display: 'flex',
        width: '100%',
        height: 200,
        marginBottom: '20px',
        fontSize: '32px',
      }}
    >
      <div
        style={{
          background: '#facc15',
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        yellow #FACC15
        <Button
          size="lg"
          style={{
            fontSize: '20px',
            padding: '16px 32px',
            background: '#5D4037',
            color: '#facc15',
          }}
        >
          click
        </Button>
      </div>
      <div
        style={{
          background: '#5D4037',
          flex: 1,
          color: '#facc15',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        brown #5D4037
        <Button size="lg" style={{ fontSize: '20px', padding: '16px 24px' }}>
          click
        </Button>
      </div>
      <div
        style={{
          background: '#D7CCC8',
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        taupe #D7CCC8
        <Button
          size="lg"
          style={{
            fontSize: '20px',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          click
        </Button>
      </div>
      <div
        style={{
          background: '#F9F9F9',
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        neutral #F9F9F9
        <Button size="lg" style={{ fontSize: '20px', padding: '16px 24px' }}>
          click
        </Button>
      </div>
    </div>
  );
}
