using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Pizzaria.Dominio.Entidades
{
    public class Periodo
    {
        public virtual int Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual IList<Garcom> Garcoms { get; set; } 
    }
}
