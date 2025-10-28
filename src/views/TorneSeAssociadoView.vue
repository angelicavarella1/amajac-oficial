<template>
    <!-- Vue Component: TorneSeSocioView -->
    <!-- Todo o conteúdo da seção e do modal de credenciamento -->
    <div class="min-h-screen flex items-center justify-center p-4">

        <!-- Card Principal - Torne-se Sócio -->
        <div class="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-none dark:border dark:border-green-600 rounded-xl p-8 md:p-12 transition-colors duration-500">
            
            <!-- Toggle Dark Mode -->
            <div class="flex justify-end mb-6">
                <button @click="toggleTheme" class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <span class="text-sm font-medium hidden md:inline" id="toggleText">{{ isDark ? 'Desativar Dark Mode' : 'Ativar Dark Mode' }}</span>
                    <div class="toggle-switch">
                        <div class="toggle-dot" :class="{'transform translate-x-6': isDark}"/>
                    </div>
                </button>
            </div>
            
            <!-- Cabeçalho -->
            <div class="text-center mb-10">
                <!-- Icone para Profissionais de Serviço (Verde) -->
                <svg class="mx-auto h-12 w-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 4V2m-4 2V2m-4 2V2m12 14v-2m-2-3H6m14-4H4m0 0l-2-2m2 2l2-2m-4 4l-2 2m2-2l2 2m-4 4h16a2 2 0 002-2v-8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4">Torne-se Associado Credenciado</h1>
                <p class="text-lg text-gray-600 dark:text-gray-400 mt-2 font-semibold">Apenas profissionais aprovados e verificados podem anunciar nos classificados.</p>
            </div>

            <!-- Mensagem de Confiança (Reforçada) -->
            <div class="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg mb-8">
                <p class="text-center text-sm font-bold text-green-800 dark:text-green-300">
                    ⭐ Adesão Única: Taxa mensal fixa de <strong>R$ 30,00</strong> após aprovação no credenciamento.
                </p>
            </div>

            <!-- Lista de Benefícios Focados em Anúncios para Serviços Domésticos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 mb-10">
                <div class="flex items-start space-x-3">
                    <svg class="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <p><strong>Visibilidade Máxima:</strong> Seu serviço em destaque nos classificados para clientes locais.</p>
                </div>
                <div class="flex items-start space-x-3">
                    <svg class="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <p><strong>Confiança e Credibilidade:</strong> Use o selo de profissional associado da associação.</p>
                </div>
                <div class="flex items-start space-x-3">
                    <svg class="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <p><strong>Clientes em Contato:</strong> Receba pedidos de orçamento diretamente no seu e-mail ou telefone.</p>
                </div>
                <div class="flex items-start space-x-3">
                    <svg class="h-6 w-6 text-green-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <p>Controle Total: Edite seus serviços e disponibilidade a qualquer momento.</p>
                </div>
            </div>

            <!-- CTA para abrir o Modal -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h2 class="text-center text-xl font-semibold text-gray-900 dark:text-white mb-4">Inicie o seu Credenciamento</h2>
                <p class="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm">Preencha o nosso formulário de registro profissional. <strong>Após a sua aprovação pela associação</strong>, você receberá instruções para o pagamento da taxa de R$ 30,00/mês e o acesso ao formulário de anúncio.</p>
                <!-- Cor do botão alterada para verde -->
                <button @click="openModal" class="w-full py-4 px-6 bg-green-600 text-white font-bold text-xl rounded-lg shadow-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 transform hover:scale-[1.01]">
                    Tornar-me Associado Credenciado
                </button>
            </div>

        </div>

        <!-- Modal para Formulário de Credenciamento (Condicional via v-if) -->
        <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-75 dark:bg-opacity-90 flex items-center justify-center p-4 z-50 transition-opacity duration-300" @click.self="closeModal">
            <div class="modal-content bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto p-6 md:p-8">
                <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Registro e Credenciamento Profissional</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                
                <form @submit.prevent="handleFormSubmit" class="space-y-4 pt-6">
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">Todos os campos são obrigatórios para a verificação e aprovação do seu registro, garantindo a confiança da nossa comunidade.</p>

                    <!-- Campo Nome -->
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Seu Nome Completo (Obrigatório)</label>
                        <input type="text" id="name" v-model="formData.name" required
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500 
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Ex: João da Silva"/>
                    </div>
                    
                    <!-- Campo CPF -->
                    <div>
                        <label for="cpf" class="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF (Cadastro de Pessoa Física)</label>
                        <input type="text" id="cpf" v-model="formData.cpf" required @input="formatarCPF"
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="000.000.000-00" maxlength="14"/>
                    </div>

                    <!-- Campo Endereço Residencial -->
                    <div>
                        <label for="addressResidencial" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço Residencial Completo</label>
                        <input type="text" id="addressResidencial" v-model="formData.addressResidencial" required
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Rua, número, complemento e CEP"/>
                    </div>

                    <!-- Campo Endereço Comercial -->
                    <div>
                        <label for="addressComercial" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço Comercial (Se aplicável, ou repita o residencial)</label>
                        <input type="text" id="addressComercial" v-model="formData.addressComercial" required
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Rua, número, complemento e CEP do local de trabalho"/>
                    </div>
                    
                    <!-- Campo Serviço Principal -->
                    <div>
                        <label for="service" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Serviço Principal de Atuação</label>
                        <select id="service" v-model="formData.service" required
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400">
                            <option value="">Selecione seu serviço principal</option>
                            <option value="eletricista">Eletricista Residencial</option>
                            <option value="encanador">Encanador/Desentupidor</option>
                            <option value="pedreiro">Pedreiro/Assentador</option>
                            <option value="pintor">Pintor</option>
                            <option value="jardineiro">Jardineiro</option>
                            <option value="diarista">Diarista</option>
                            <option value="cuidador">Cuidador de Idosos</option>
                            <option value="petsitter">Pet Sitter</option>
                            <option value="montador">Montador de Móveis</option>
                            <option value="tecnico">Técnico em Eletrônicos</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>

                    <!-- Campo Telefone de Contato -->
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone de Contato (com DDD)</label>
                        <input type="tel" id="phone" v-model="formData.phone" required @input="formatarTelefone"
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="(21) 99999-9999" maxlength="15"/>
                    </div>

                    <!-- Campo WhatsApp -->
                    <div>
                        <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp</label>
                        <input type="tel" id="whatsapp" v-model="formData.whatsapp" required @input="formatarWhatsApp"
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="(21) 99999-9999" maxlength="15"/>
                    </div>

                    <!-- Campo Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email de Contato Profissional</label>
                        <input type="email" id="email" v-model="formData.email" required
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="seu.email.profissional@exemplo.com.br"/>
                    </div>

                    <!-- Campo Motivação -->
                    <div>
                        <label for="motivacao" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Por que quer se tornar um associado credenciado?</label>
                        <textarea id="motivacao" v-model="formData.motivacao" required rows="3"
                            class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 text-gray-900 
                                    bg-gray-50 focus:border-green-500 focus:ring-green-500
                                    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            placeholder="Conte um pouco sobre sua motivação e experiência..."/>
                    </div>
                    
                    <!-- Termos e Condições -->
                    <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <input
                            id="aceitou_termos"
                            v-model="formData.aceitou_termos"
                            type="checkbox"
                            required
                            class="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label for="aceitou_termos" class="text-sm text-gray-600 dark:text-gray-300">
                            Concordo com os 
                            <a href="/termos-associacao" target="_blank" class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium underline">
                                termos e condições
                            </a> 
                            e autorizo o tratamento dos meus dados pessoais para fins de credenciamento.
                        </label>
                    </div>
                    
                    <!-- Informação de valor fixo -->
                    <div class="p-3 text-center rounded-lg bg-green-100 dark:bg-green-900">
                        <p class="font-bold text-green-800 dark:text-green-200">Taxa Mensal Fixa: R$ 30,00</p>
                        <p class="text-xs text-green-700 dark:text-green-300">Este valor será cobrado após a aprovação do seu credenciamento.</p>
                    </div>
                    
                    <!-- Mensagem de Confirmação (custom alert) -->
                    <div v-if="messageBox.isVisible" :class="messageBox.classes">
                        {{ messageBox.text }}
                    </div>

                    <!-- Botão de Submissão -->
                    <button type="submit" :disabled="loading" class="w-full mt-6 py-3 px-6 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <svg v-if="loading" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>{{ loading ? 'Enviando...' : 'Submeter para Credenciamento' }}</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '@/supabase'

// --- Estado ---
const isModalOpen = ref(false); // Controla a visibilidade do modal
const isDark = ref(false);      // Controla o tema Dark Mode
const loading = ref(false);     // Controla estado de carregamento

// Campos do formulário (reativos)
const formData = reactive({
    name: '',
    cpf: '',
    addressResidencial: '',
    addressComercial: '',
    service: '',
    phone: '',
    whatsapp: '',
    email: '',
    motivacao: '',
    aceitou_termos: false
});

// Estado da Mensagem de Feedback
const messageBox = reactive({
    isVisible: false,
    text: '',
    classes: '' // Tailwind classes para cor/estilo
});

// Função segura para logging
const safeLogError = (operation, err) => {
  console.error(`Erro na operação ${operation}:`, {
    code: err?.code || 'unknown',
    message: err?.message ? err.message.substring(0, 100) : 'Erro desconhecido'
  });
};

// --- Funções de Formatação ---
const formatarCPF = () => {
    let valor = formData.cpf.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    formData.cpf = valor;
};

const formatarTelefone = () => {
    let valor = formData.phone.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    formData.phone = valor;
};

const formatarWhatsApp = () => {
    let valor = formData.whatsapp.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    formData.whatsapp = valor;
};

// --- Funções de Tema (Dark Mode) ---
const updateThemeUI = (isDarkValue) => {
    const toggleText = document.getElementById('toggleText');
    if (toggleText) {
        toggleText.textContent = isDarkValue ? 'Desativar Dark Mode' : 'Ativar Dark Mode';
    }
    // Adiciona/remove a classe 'dark' no <html>, essencial para Tailwind
    if (isDarkValue) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

const initializeTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDarkValue = false;

    if (storedTheme === 'dark') {
        isDarkValue = true;
    } else if (storedTheme === 'light') {
        isDarkValue = false;
    } else {
        isDarkValue = prefersDark;
    }

    isDark.value = isDarkValue;
    updateThemeUI(isDarkValue);
};

const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    updateThemeUI(isDark.value);
};

onMounted(() => {
    initializeTheme();
});

// --- Funções do Modal ---
const openModal = () => {
    isModalOpen.value = true;
    document.body.style.overflow = 'hidden'; // Evita scroll na página principal
};

const closeModal = () => {
    isModalOpen.value = false;
    document.body.style.overflow = '';
    messageBox.isVisible = false; // Oculta a mensagem ao fechar o modal
    resetForm();
};

// --- Funções de Formulário ---
const resetForm = () => {
    Object.keys(formData).forEach(key => {
        if (key === 'aceitou_termos') {
            formData[key] = false;
        } else {
            formData[key] = '';
        }
    });
};

const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação do CPF
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
};

const handleFormSubmit = async () => {
    const { name, cpf, addressResidencial, addressComercial, service, phone, whatsapp, email, motivacao, aceitou_termos } = formData;
    
    // Verifica se todos os campos estão preenchidos
    if (!name || !cpf || !addressResidencial || !addressComercial || !service || !phone || !whatsapp || !email || !motivacao || !aceitou_termos) {
        messageBox.classes = 'text-center p-3 text-sm rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-600';
        messageBox.text = 'Por favor, preencha todos os campos do formulário e aceite os termos para iniciar o credenciamento.';
        messageBox.isVisible = true;
        return;
    }

    // Validar CPF
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (!validarCPF(cpfLimpo)) {
        messageBox.classes = 'text-center p-3 text-sm rounded-lg bg-red-100 text-red-800 border border-red-300 dark:bg-red-800 dark:text-red-100 dark:border-red-600';
        messageBox.text = 'CPF inválido. Verifique o número digitado.';
        messageBox.isVisible = true;
        return;
    }

    loading.value = true;

    try {
        // ✅ CORREÇÃO: Verificar se CPF já existe SEM .single() para evitar erro 400
        const { data: existingSocios, error: checkError } = await supabase
            .from('socios')
            .select('id')
            .eq('cpf', cpfLimpo)
            .limit(1); // ✅ Usar .limit(1) em vez de .single()

        if (checkError) {
            safeLogError('verificacao_cpf', checkError);
            throw new Error('Erro ao verificar CPF. Tente novamente.');
        }

        // ✅ CORREÇÃO: Verificar se encontrou algum registro
        if (existingSocios && existingSocios.length > 0) {
            messageBox.classes = 'text-center p-3 text-sm rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-800 dark:text-yellow-100 dark:border-yellow-600';
            messageBox.text = 'CPF já cadastrado. Entre em contato conosco se precisar de ajuda.';
            messageBox.isVisible = true;
            loading.value = false;
            return;
        }

        // Montar endereço completo
        const enderecoCompleto = `${addressResidencial}${addressComercial !== addressResidencial ? ` | Comercial: ${addressComercial}` : ''}`;

        // Inserir na tabela 'socios'
        const { data, error } = await supabase
            .from('socios')
            .insert([{
                nome: name.trim(),
                cpf: cpfLimpo,
                telefone: phone.replace(/\D/g, ''),
                email: email.trim().toLowerCase(),
                endereco: enderecoCompleto,
                profissao: service,
                status: 'pendente_credenciamento',
                data_inscricao: new Date().toISOString(),
                motivacao: motivacao.trim(),
                aceitou_termos: aceitou_termos,
                tipo_servico: service,
                whatsapp: whatsapp.replace(/\D/g, '')
            }])
            .select();

        if (error) {
            safeLogError('insercao_socio', error);
            throw error;
        }

        // Sucesso
        messageBox.classes = 'text-center p-3 text-sm rounded-lg bg-green-100 text-green-800 border border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-600';
        messageBox.text = 'Formulário enviado com sucesso! Um administrador irá analisar seus dados e entrará em contato em breve para dar prosseguimento ao seu credenciamento e formalizar a sua associação. Por favor, aguarde.';
        messageBox.isVisible = true;

        // Resetar o formulário após 3 segundos
        setTimeout(() => {
            resetForm();
            closeModal();
        }, 3000);

    } catch (error) {
        console.error('Erro ao cadastrar credenciamento:', error);
        
        if (error.code === '23505') { // Violação de chave única
            messageBox.classes = 'text-center p-3 text-sm rounded-lg bg-red-100 text-red-800 border border-red-300 dark:bg-red-800 dark:text-red-100 dark:border-red-600';
            messageBox.text = 'CPF já cadastrado no sistema. Entre em contato conosco se precisar de ajuda.';
        } else {
            messageBox.classes = 'text-center p-3 text-sm rounded-lg bg-red-100 text-red-800 border border-red-300 dark:bg-red-800 dark:text-red-100 dark:border-red-600';
            messageBox.text = 'Erro ao enviar credenciamento. Tente novamente ou entre em contato conosco.';
        }
        messageBox.isVisible = true;
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* Custom styles for the toggle switch */
.toggle-switch {
    @apply w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-200 dark:bg-gray-600;
}
.toggle-dot {
    @apply w-6 h-6 bg-white rounded-full shadow-md transform duration-200 ease-in-out;
}
/* Cor do ponto de alternância alterada para verde no Dark Mode */
:root.dark .toggle-dot {
    @apply bg-green-400; 
}

/* Animações para o modal */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
    transition: transform 0.3s ease;
}

.modal-enter-from .modal-content {
    transform: scale(0.9);
}

.modal-leave-to .modal-content {
    transform: scale(0.9);
}
</style>