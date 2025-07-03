router.get('/ingresos', async (req, res) => {
    try {
      const ingresos = await Transaction.find({ type: 'ingreso' });
      const total = ingresos.reduce((acc, tx) => acc + tx.amount, 0);
      res.json({ total, ingresos });
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los ingresos' });
    }
  });
  