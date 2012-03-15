using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pizzaria.Dominio.Entidades
{
    public class Garcom
    {
        public virtual int Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual IList<Periodo> Periodos { get; set; }

        public virtual void SalvarPeriodo(Periodo periodo)
        {
            if (Periodos == null)
            {
                Periodos = new List<Periodo>();
            }
            if (periodo.Garcoms == null)
            {
                periodo.Garcoms = new List<Garcom>();
            }
            Periodos.Add(periodo);
        }
    }
}
