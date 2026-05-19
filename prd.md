PRD — CLARA
Assistente Pedagógica de Rotina Escolar

Versão: 0.1
Produto: Mônica
Público inicial: Ensino Fundamental II
Sistema oficial externo: ActiveSoft/Activesoft
Status: Draft para validação com direção, coordenação e engenharia

1. Contexto

A escola precisa melhorar o registro de chamada, tarefas não realizadas e ocorrências pedagógicas/disciplinarizadas do Fundamental II. O problema atual não é apenas registrar ocorrências, mas transformar relatos soltos, subjetivos e difíceis de comparar em dados pedagógicos objetivos, padronizados e acionáveis. O material base do projeto já define a necessidade de padronização por eixos A–F, geração de texto limpo, mapeamento para ActiveSoft e relatórios por aluno, turma, eixo, gravidade e reincidência.

A ActiveSoft já possui Portal do Professor, frequência em lote e registro de ocorrências individuais ou em lote. Na criação de ocorrência, o professor pode preencher data, tipo, observação e marcar “Exibir na internet”, se desejar. Isso confirma que a ActiveSoft pode ser o sistema oficial, mas também mostra o risco: se a observação for mal escrita ou exposta diretamente aos responsáveis, pode gerar problema pedagógico, jurídico e institucional.

2. Problema

Professoras têm pouco tempo durante a aula. Elas precisam fazer chamada, verificar tarefa, conduzir conteúdo, lidar com comportamento, orientar alunos e ainda registrar informações no sistema.

Formulários longos ou sistemas com muitos cliques geram baixa adesão. Quando a professora registra rapidamente por texto ou áudio, a linguagem pode sair informal, emocional, incompleta ou inadequada para virar histórico oficial do aluno.

O problema central é:

Como permitir que a professora registre a rotina da aula em poucos segundos, sem transformar texto bruto em registro oficial ruim?

3. Objetivos
Objetivo principal

Criar uma assistente chamada Mônica para ajudar professoras a registrar chamada, tarefa e ocorrências de forma rápida, segura, pedagógica e compatível com a ActiveSoft.

Objetivos específicos
Reduzir o tempo de registro da professora.
Permitir chamada rápida por turma.
Permitir registro em lote para casos objetivos, como tarefa não realizada.
Permitir registro individual para ocorrências disciplinares ou sensíveis.
Gerar texto pedagógico adequado automaticamente.
Impedir que texto bruto ou áudio seja enviado diretamente para ActiveSoft.
Impedir que nome de outro aluno apareça no registro individual.
Criar fila de revisão da coordenação.
Manter ActiveSoft como sistema oficial.
Criar base para relatórios por turma, aluno, eixo, gravidade e reincidência.
4. Não objetivos do MVP

O MVP não deve:

substituir completamente a ActiveSoft;
publicar ocorrências automaticamente para responsáveis;
enviar áudio, transcrição literal ou texto bruto para ActiveSoft;
depender de API de ocorrência da ActiveSoft sem confirmação formal;
permitir que IA decida sozinha gravidade final em casos sensíveis;
transformar todo registro pedagógico em ocorrência disciplinar;
expor nomes de outros alunos no histórico individual;
criar um chatbot livre demais, sem fluxo guiado e sem confirmação.
5. Usuários
Professora

Precisa registrar rapidamente:

presença/falta;
tarefa não realizada;
material ausente;
atividade incompleta;
falta de foco;
conversa recorrente;
conflito individual;
uso indevido de tecnologia;
registro positivo.
Coordenação

Precisa:

revisar registros;
aprovar texto final;
bloquear textos inadequados;
decidir o que vai para ActiveSoft;
decidir o que pode ser exibido para responsáveis;
acompanhar reincidência;
tratar casos sensíveis.
Direção

Precisa:

enxergar padrões por turma;
acompanhar clima pedagógico;
identificar turmas com mais registros;
preparar reuniões com famílias;
tomar decisões com base em dados.
Responsáveis/famílias

Devem receber apenas comunicações pedagógicas revisadas, claras, respeitosas e sem exposição indevida de outros estudantes.

6. Premissas
A ActiveSoft será o sistema oficial de histórico escolar.
A Mônica será uma camada de captura, normalização e revisão.
Nem todo registro feito pela professora deve virar ocorrência oficial.
Tarefa não realizada pode ser capturada em lote.
Ocorrências disciplinares e sensíveis exigem revisão individual.
“Exibir na internet” deve ficar desativado por padrão.
A integração automática com ActiveSoft depende de confirmação técnica da ActiveSoft.
A documentação pública confirma API para frequência, mas não encontrei documentação pública equivalente confirmando criação de ocorrência pedagógica via API. A ActiveSoft documenta API api/v1/marcar_frequencia_aluno/ para registros de frequência, e não devemos assumir que o mesmo existe para ocorrências sem confirmação.
7. Produto proposto
Nome

Mônica — Assistente Pedagógica de Rotina Escolar

Descrição curta

Mônica é uma assistente web/PWA com recursos de IA controlada, criada para ajudar professoras a registrar chamada, tarefa e ocorrências pedagógicas durante a rotina da aula, gerando textos seguros e padronizados para revisão da coordenação e posterior lançamento na ActiveSoft.

8. Abordagem recomendada
Recomendação

Começar com PWA/web app guiado, não WhatsApp como canal principal.

Por quê?

WhatsApp parece mais simples, mas aumenta risco de:

erro de nomes;
mistura com celular pessoal;
exposição de dados;
dificuldade de seleção múltipla;
conversas longas;
registros sem estrutura.

A melhor interface inicial é uma tela simples:

Hoje:
07:30 — 6ºA — Matemática
08:20 — 7ºB — Matemática

[Iniciar aula]

Depois:

1. Fazer chamada
2. Verificar tarefa
3. Registrar ocorrência
4. Fechar resumo da aula
9. Escopo do MVP
Módulo 1 — Login e perfil

A professora acessa a Mônica com login seguro.

Requisitos:

professora só vê suas turmas;
coordenação vê turmas autorizadas;
direção vê relatórios agregados;
logs de acesso e ação.
Módulo 2 — Aulas do dia

A Mônica mostra as aulas da professora no dia.

Exemplo:

Bom dia, professora Ana.

Aulas de hoje:
07:30 — 6ºA — Matemática
08:20 — 6ºB — Matemática
09:10 — 7ºA — Matemática

A professora clica em Iniciar aula.

Módulo 3 — Chamada rápida

A professora vê a lista da turma.

Quem está ausente?

[ ] Ana Clara
[ ] Bruno
[ ] Caio
[ ] Davi

[Todos presentes]
[Salvar chamada]

Estados possíveis:

presente;
ausente;
falta justificada;
atraso;
saída antecipada;
não informado.

A ActiveSoft já documenta frequência em lote no Portal do Professor, com opções como presente, falta, falta justificada, dispensa e não informado.

Módulo 4 — Tarefa de casa

Depois da chamada, a Mônica pergunta:

Houve tarefa para hoje?

[Todos fizeram]
[Alguns não fizeram]
[Não houve tarefa]
[Pular]

Se “Alguns não fizeram”:

Selecione os alunos que não apresentaram a tarefa:

[ ] Ana Clara
[x] Bruno
[ ] Caio
[x] Davi
[x] Elisa

[Registrar]

A Mônica cria um evento em lote, mas gera registros individuais.

Texto individual sugerido:

O estudante não apresentou a atividade de casa solicitada para a aula de Matemática. O registro tem finalidade de acompanhamento pedagógico da rotina de estudos.

Regra obrigatória:

O registro individual de Bruno não pode citar Davi, Elisa ou qualquer outro aluno.

Módulo 5 — Registro rápido de ocorrência

A professora escolhe botões simples.

Registrar algo nesta aula?

[Material ausente]
[Tarefa não realizada]
[Atividade incompleta]
[Conversa/falta de foco]
[Descumpriu orientação]
[Conflito com colega]
[Uso de celular/tecnologia]
[Saída/circulação]
[Registro positivo]
[Outro]

A professora não deve ver a lista completa A1, A2, B1, B2, C1 etc. Esses códigos ficam no motor interno da Mônica.

A ActiveSoft permite criar tipos de ocorrência com categoria Pedagógica, Disciplinar, Financeira ou Psicológica, além de configurar se o tipo fica disponível no Portal do Professor e para quais perfis. Isso permite alinhar os tipos oficiais da ActiveSoft com a tipologia interna da Mônica.

Módulo 6 — Texto pedagógico automático

A professora pode escrever rápido:

Aluno xingou colega durante a atividade.

A Mônica sugere:

Durante a atividade em sala, o estudante utilizou linguagem inadequada dirigida a um colega. A professora realizou intervenção imediata e orientou o estudante quanto às regras de convivência e respeito no ambiente escolar. O caso foi encaminhado à coordenação para acompanhamento pedagógico.

A Mônica deve manter os fatos, mas melhorar a linguagem.

Ela não pode inventar:

intenção;
motivo;
diagnóstico;
punição;
reincidência não informada;
detalhes que a professora não disse.
Módulo 7 — Fila de revisão da coordenação

Todo registro terá status:

Rascunho da professora
Texto sugerido pela Mônica
Aguardando revisão
Aprovado para ActiveSoft
Lançado na ActiveSoft
Liberado para família
Arquivado
Devolvido para ajuste

Casos sensíveis devem ir automaticamente para:

Revisão obrigatória da coordenação
Módulo 8 — Integração ActiveSoft
MVP

No MVP, a Mônica gera texto aprovado para copiar/lançar na ActiveSoft.

Fluxo:

Mônica → texto aprovado → coordenação lança na ActiveSoft
Futuro

Se a ActiveSoft confirmar API/importação de ocorrências:

Mônica → payload aprovado → ActiveSoft API/importação

A integração automática só pode enviar:

aluno;
turma;
data;
tipo de ocorrência;
observação pedagógica aprovada;
“Exibir na internet”: não, por padrão;
usuário aprovador;
origem: Mônica.
10. Regras de envio para ActiveSoft
Nunca enviar

A Mônica nunca deve enviar automaticamente para ActiveSoft:

texto bruto da professora;
áudio original;
transcrição literal;
texto com linguagem vulgar;
texto com julgamento subjetivo;
texto citando outro aluno no registro individual;
texto sensível sem revisão;
mensagem para família sem aprovação.
Pode enviar

Somente após aprovação:

Data
Aluno
Turma
Professor/disciplina
Tipo ActiveSoft
Texto pedagógico aprovado
Visibilidade aos responsáveis: não por padrão
11. Regra sobre “Exibir na internet”

A ActiveSoft permite marcar “Exibir na internet” ao registrar ocorrência. Essa opção deve ser tratada como risco e nunca deve ser automática.

Regra:

Exibir na internet = NÃO por padrão.

Só pode virar “sim” quando:

coordenação aprovar;
texto estiver revisado;
não houver nome de outro aluno;
não houver linguagem sensível desnecessária;
não houver apuração pendente;
a escola decidir que a família deve visualizar.

Para casos sensíveis:

Exibir na internet = bloqueado.
12. Classificação de eventos
Eventos permitidos em lote

Podem ser registrados para vários alunos ao mesmo tempo:

tarefa não realizada;
material ausente;
atividade em sala não realizada;
atividade incompleta;
registro positivo coletivo, desde que sem ranking;
falta/presença.
Eventos que devem ser individuais

Devem ser tratados aluno por aluno:

xingamento;
conflito entre estudantes;
desrespeito a professor ou funcionário;
conduta de conotação sexual;
agressão física;
uso indevido de celular/imagem/áudio;
discriminação;
ameaça;
bullying;
caso de saúde mental;
qualquer caso grave ou gravíssimo.
13. Regras de linguagem
Evitar
mal-educado
debochado
sem vergonha
não quer nada
quis afrontar
fez gracinha
insuportável
preguiçoso
Preferir
não atendeu à orientação
permaneceu conversando após intervenção
não apresentou a atividade solicitada
utilizou linguagem inadequada
interferiu no andamento da atividade
necessita acompanhamento da rotina de estudos
foi encaminhado à coordenação para orientação pedagógica
14. Segurança, LGPD e proteção de menores

A Mônica lidará com dados de crianças/adolescentes. Pela LGPD, o tratamento de dados pessoais de crianças e adolescentes deve observar o melhor interesse do menor; a ANPD também vem tratando o tema como pauta regulatória específica.

O ECA protege o direito ao respeito, incluindo integridade física, psíquica e moral, imagem, identidade, autonomia, valores, ideias, crenças e espaços pessoais da criança e do adolescente.

Requisitos obrigatórios:

mínimo necessário de dados;
controle de acesso por perfil;
log de quem criou, editou, revisou e enviou;
separação entre texto bruto, texto interno, texto ActiveSoft e texto família;
não exposição de outros alunos;
revisão humana em casos sensíveis;
retenção limitada de áudio/transcrição;
criptografia em trânsito;
backup;
trilha de auditoria.
15. Modelo de dados sugerido
Aula
id
data
turma_id
professor_id
disciplina_id
horario_inicio
horario_fim
status
Chamada
id
aula_id
aluno_id
status_presenca
registrado_por
registrado_em
origem
Evento pedagógico
id
aula_id
tipo_evento
eixo
codigo_interno
gravidade_sugerida
descricao_bruta
criado_por
criado_em
status_revisao
sensitive_case
requires_coordinator_approval
Participante do evento
evento_id
aluno_id
papel

Papéis:

estudante_registrado
envolvido
testemunha
não_exibir_em_texto
Registro individual
id
evento_id
aluno_id
raw_teacher_note
normalized_internal_summary
activesoft_observation_draft
family_message_draft
approved_activesoft_observation
approved_family_message
visibility_to_family
approved_by
approved_at
sent_to_activesoft_at
16. Fluxos principais
Fluxo 1 — Chamada
Professora inicia aula
↓
Mônica puxa lista de alunos
↓
Professora marca ausentes ou “todos presentes”
↓
Mônica salva chamada
↓
Se houver API confirmada, sincroniza frequência
↓
Se não houver API, gera relatório/lançamento assistido
Fluxo 2 — Tarefa não realizada em lote
Professora escolhe “Alguns não fizeram”
↓
Seleciona alunos
↓
Mônica cria evento em lote
↓
Mônica gera registros individuais
↓
Texto não cita outros alunos
↓
Coordenação revisa por regra/amostragem
↓
Registro aprovado pode ser lançado na ActiveSoft
Fluxo 3 — Ocorrência disciplinar individual
Professora registra por botão, texto ou áudio
↓
Mônica transcreve/estrutura
↓
Mônica sugere tipo, eixo e gravidade
↓
Mônica gera texto pedagógico
↓
Caso vai para revisão obrigatória
↓
Coordenação aprova/edita
↓
Coordenação decide ActiveSoft
↓
Coordenação decide família
17. Critérios de aceite
Chamada
Professora consegue registrar chamada em até 60 segundos.
Professora consegue marcar “todos presentes” em um clique.
Sistema registra autor, data e turma.
Frequência não é enviada automaticamente à ActiveSoft sem configuração validada.
Tarefa em lote
Professora consegue registrar 5 alunos sem tarefa em até 30 segundos.
Sistema cria registros individuais.
Nenhum registro individual cita nome de outro aluno.
Texto gerado usa linguagem pedagógica.
Ocorrência individual
Professora consegue registrar ocorrência por texto curto.
Mônica gera sugestão de texto limpo.
Caso sensível exige aprovação da coordenação.
Texto bruto não é enviado para ActiveSoft.
“Exibir na internet” fica desativado por padrão.
Revisão
Coordenação consegue aprovar, editar, devolver ou arquivar.
Toda aprovação tem log.
Texto final aprovado fica separado do texto bruto.
ActiveSoft
MVP permite copiar/lançar texto aprovado.
Integração automática só será habilitada se a ActiveSoft confirmar endpoint/importação oficial.
Payload nunca envia áudio, transcrição literal ou texto bruto.
18. Métricas de sucesso
70% das professoras do piloto usando semanalmente.
Chamada registrada em até 60 segundos.
Tarefa em lote registrada em até 30 segundos.
90% dos textos aprovados sem reescrita pesada da coordenação.
0 registros individuais com nome indevido de outro aluno.
100% dos casos graves/sensíveis revisados antes de qualquer publicação.
Redução do retrabalho da coordenação.
Aumento da qualidade dos registros pedagógicos.
19. Riscos e mitigação
Risco	Mitigação
Professora não aderir	Interface de poucos cliques
Chatbot virar formulário longo	Fluxo guiado por rotina da aula
IA errar nome de aluno	Confirmação visual obrigatória
Texto ruim ir para ActiveSoft	Revisão obrigatória e bloqueio
Família ver texto sensível	“Exibir na internet” desligado por padrão
Nome de outro aluno aparecer	Separação evento coletivo vs registro individual
ActiveSoft não ter API de ocorrência	MVP com lançamento assistido
Dados de menores expostos	Controle de acesso, logs e minimização
20. Fases do projeto
Fase 1 — MVP sem IA pesada
login;
aulas do dia;
chamada;
tarefa em lote;
tipos simples;
geração de texto por template;
fila de revisão;
lançamento assistido na ActiveSoft.
Fase 2 — IA controlada
melhoria de texto;
sugestão de eixo/código;
detecção de linguagem inadequada;
alerta de caso sensível;
checagem de nomes de outros alunos.
Fase 3 — Voz dentro da PWA
professora dita;
Mônica transcreve;
professora confirma;
coordenação revisa.
Fase 4 — WhatsApp opcional
canal alternativo;
nunca canal único;
confirmação obrigatória;
sem publicação automática.
Fase 5 — Integração ActiveSoft
confirmar documentação;
validar token/permissões;
sandbox/teste;
logs;
envio apenas de dados aprovados.
21. Perguntas em aberto
A ActiveSoft da escola permite API para consultar alunos/turmas?
A ActiveSoft permite API ou importação para ocorrências?
A escola quer que frequência seja sincronizada automaticamente ou apenas assistida?
Quais tipos de ocorrência ficarão visíveis para professoras?
Quem na coordenação pode aprovar registros?
Em quais casos a família deve ver a ocorrência no portal?
Qual será o prazo de retenção de áudio/transcrição?
A escola quer piloto com quais turmas?
A Mônica será usada no celular, tablet, computador ou todos?
A escola quer WhatsApp apenas depois do MVP web?
22. Recomendação final

A Mônica deve ser construída como:

Modo Aula + Checklist rápido + IA controlada + Revisão da coordenação + ActiveSoft como sistema oficial

Não como:

Chatbot livre que manda ocorrência direto para ActiveSoft

Minha recomendação técnica é começar com PWA/web, chamada e tarefa em lote. Depois adicionar IA de texto. Depois voz. Depois WhatsApp. Integração automática com ActiveSoft só depois de confirmação formal.