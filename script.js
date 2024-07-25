document.addEventListener('DOMContentLoaded', () => {
    const agendamentoForm = document.getElementById('bookingForm');
    const dataInput = document.getElementById('date');
    const horarioSelect = document.getElementById('horario');
    const serviceSelect = document.getElementById('service');
  
    agendamentoForm.addEventListener('submit', function(event) {
      event.preventDefault();
      agendarHorario();
    });
  
    dataInput.addEventListener('change', () => {
      const dataSelecionada = new Date(dataInput.value);
      const dia = dataSelecionada.getDate();
      const mes = dataSelecionada.getMonth() + 1; // Janeiro é 0
      const ano = dataSelecionada.getFullYear();
  
      // Marcar os dias fechados (domingo e segunda-feira) no calendário
      marcarDiasFechadosNoCalendario();
  
      if (ehDomingo(dataSelecionada) || ehSegunda(dataSelecionada)) {
        alertaFechado(dataSelecionada); // Chamada da função para verificar se é domingo ou segunda
      } else {
        mostrarHorariosDisponiveis(dataSelecionada);
      }
    });
  
    function agendarHorario() {
      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('phone').value;
      const dataSelecionada = new Date(dataInput.value); // Convertendo para objeto Date
      const horario = horarioSelect.value;
      const servico = serviceSelect.value;
  
      // Verificar se é um domingo ou segunda-feira
      if (ehDomingo(dataSelecionada) || ehSegunda(dataSelecionada)) {
        alert('O salão está fechado aos domingos e segundas-feiras.');
        return;
      }
  
      // Verificar se o horário já está agendado
      if (ehHorarioJaAgendado(dataSelecionada, horario)) {
        alert(`O horário das ${horario} no dia ${formatarData(dataSelecionada)} já está agendado. Por favor, escolha outro horário.`);
        mostrarHorariosDisponiveis(dataSelecionada);
        return;
      }
  
      // Salvando o agendamento
      let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      agendamentos.push({ data: dataSelecionada.toISOString(), horario });
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
  
      // Enviando para o WhatsApp
      enviarParaWhatsApp(nome, telefone, dataSelecionada, horario, servico);
  
      // Alerta de agendamento realizado
      alert(`Agendamento feito para o dia ${formatarData(dataSelecionada)} às ${horario}.`);
  
      // Atualizando o calendário visualmente
      marcarDiasNoCalendario();
    }
  
    function enviarParaWhatsApp(nome, telefone, data, horario, servico) {
      const mensagem = `Olá, gostaria de marcar um serviço:\nNome: ${nome}\nTelefone: ${telefone}\nData: ${formatarData(data)}\nHorário: ${horario}\nServiço: ${servico}`;
      const numeroWhatsApp = '5534998323600'; // Insira o número da barbearia aqui
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    }
  
    function mostrarHorariosDisponiveis(data) {
      const horarios = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
      let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  
      // Filtrar os horários disponíveis para o dia específico
      const horariosDisponiveis = horarios.filter(hora => {
        return !agendamentos.some(agendamento => agendamento.data === data.toISOString() && agendamento.horario === hora);
      });
  
      alert(`Horários disponíveis para o dia ${formatarData(data)}:\n${horariosDisponiveis.join(', ')}`);
    }
  
    function marcarDiasFechadosNoCalendario() {
      const diasFechados = ['0', '1']; // 0 = domingo, 1 = segunda-feira
      const diasAmarelos = document.querySelectorAll('.calendar-day[data-date]');
  
      // Remover a marcação existente
      diasAmarelos.forEach(dia => {
        dia.style.backgroundColor = '';
      });
  
      // Marcar os dias fechados
      diasAmarelos.forEach(dia => {
        const data = new Date(dia.getAttribute('data-date'));
        if (diasFechados.includes(data.getUTCDay().toString())) {
          dia.style.backgroundColor = 'red'; // Destaque em vermelho para dias fechados
        }
      });
    }
  
    function marcarDiasNoCalendario() {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      const diasAmarelos = document.querySelectorAll('.calendar-day[data-date]');
  
      // Remover a marcação amarela existente
      diasAmarelos.forEach(dia => {
        dia.style.backgroundColor = '';
      });
  
      // Marcar os novos dias agendados
      agendamentos.forEach(agendamento => {
        const data = new Date(agendamento.data);
        const dia = data.getDate();
        const mes = data.getMonth() + 1; // Janeiro é 0
        const ano = data.getFullYear();
  
        marcarDiaNoCalendario(ano, mes, dia);
      });
    }
  
    function marcarDiaNoCalendario(ano, mes, dia) {
      const diaElement = document.querySelector(`.calendar-day[data-date="${ano}-${mes}-${dia}"]`);
      if (diaElement) {
        diaElement.style.backgroundColor = 'yellow';
      }
    }
  
    function formatarData(data) {
      const partes = data.toISOString().split('T')[0].split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`; // Formatando para dd/mm/aaaa
    }
  
    function ehDomingo(data) {
      const diaSemana = data.getUTCDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
      return diaSemana === 0;
    }
  
    function ehSegunda(data) {
      const diaSemana = data.getUTCDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
      return diaSemana === 1;
    }
  
    function ehHorarioJaAgendado(data, horario) {
      let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      return agendamentos.some(agendamento => agendamento.data === data.toISOString() && agendamento.horario === horario);
    }
  
    function alertaFechado(data) {
      if (ehDomingo(data) || ehSegunda(data)) {
        alert('O salão está fechado aos domingos e segundas-feiras.');
      }
    }
  });
  