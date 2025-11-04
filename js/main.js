const modalData = {
  'about-modal': {
    title: 'About Me',
    content:
      '<p><strong>DevOps &amp; Systems Engineer with 7+ years of hands-on experience</strong> building, automating, and securing modern cloud-native infrastructures. I specialize in Infrastructure as Code with Terraform, configuration management with Ansible, and the design of advanced CI/CD pipelines using GitLab CI, GitHub Actions, and Jenkins.</p><p>My expertise spans <strong>multi-cloud architectures (AWS focus)</strong>, Docker containerization, network automation, and team enablement for scalable software delivery.</p><h4 style="color: var(--primary); margin-top: 16px;">Key Strengths</h4><ul><li>Architecting resilient, observable, and secure systems for e-commerce and SaaS</li><li>Migrating legacy solutions to isolated AWS environments using best practices</li><li>Developing reusable Ansible roles and libraries to boost team productivity</li><li>Integrating monitoring, logging, and security solutions (ELK, Grafana, New Relic)</li><li>Automating complex deployment, networking and security compliance tasks</li><li>Excelling in fast-paced, multicultural engineering teams</li></ul><p style="margin-top: 16px;">Beyond technology, I am committed to <strong>continuous improvement</strong>, performance tuning, and knowledge sharing through both documentation and mentorship. I thrive in environments that value reliability, security, and innovation in cloud and DevOps practices.</p>',
  },
  'skills-modal': {
    title: 'Skills &amp; Technologies',
    content:
      '<p>I have proficiency in diverse tools and technologies in infrastructure automation, cloud platforms, configuration management, container orchestration, monitoring, and scripting.</p><h4 style="color: var(--primary); margin-top: 12px;">Core Technologies</h4><ul><li><strong>IaC &amp; Configuration:</strong> Terraform, Ansible</li><li><strong>Cloud Platforms:</strong> AWS, Azure</li><li><strong>Containers &amp; Orchestration:</strong> Docker, Kubernetes</li><li><strong>Monitoring &amp; Logging:</strong> ELK Stack, Grafana, New Relic, Elastic Cloud Enterprise</li><li><strong>CI/CD:</strong> Jenkins, GitLab CI, GitHub Actions</li><li><strong>Scripting &amp; Automation:</strong> Bash, Python, Groovy</li><li><strong>Version Control:</strong> Git, GitHub, GitLab, Bitbucket</li><li><strong>Networking &amp; Security:</strong> Network automation, security hardening, compliance</li></ul>',
  },
  'expertise-modal': {
    title: 'Expertise Areas',
    content:
      '<h4 style="color: var(--primary); margin-bottom: 12px;">Design &amp; Architecture</h4><ul><li>Infrastructure as Code (Terraform) for reproducible, version-controlled deployments</li><li>CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions) - design, integration, optimization</li><li>Container orchestration and management with Docker &amp; Kubernetes</li><li>Multi-cloud and hybrid-cloud strategies with focus on AWS</li></ul><h4 style="color: var(--primary); margin-top: 16px; margin-bottom: 12px;">Operations &amp; Automation</h4><ul><li>Configuration management and system provisioning with Ansible</li><li>Monitoring and observability (Grafana, ELK, New Relic)</li><li>Logs aggregation and analysis for troubleshooting</li><li>Security hardening and compliance automation</li><li>Network automation and optimization</li></ul><h4 style="color: var(--primary); margin-top: 16px; margin-bottom: 12px;">Team &amp; Processes</h4><ul><li>Mentoring and knowledge transfer within engineering teams</li><li>Documentation and wiki management (Confluence, GitLab Pages)</li><li>Cross-functional collaboration in agile environments</li><li>Security-first principles in all infrastructure decisions</li></ul>',
  },
  'achievements-modal': {
    title: 'Key Achievements',
    content: '<h4 style="color: var(--primary); margin-bottom: 12px;">Major Projects</h4><ul><li><strong>AWS Account Migration:</strong> Led migration of multiple solutions from shared AWS accounts to isolated, production-grade dedicated accounts, improving security posture and cost allocation</li><li><strong>Ansible Roles Framework:</strong> Developed extensible and reusable Ansible roles and collections, enabling independent deployment and configuration management across teams</li><li>Implemented comprehensive CI/CD pipelines reducing deployment time and improving release reliability</li><li>Designed and deployed multi-tier monitoring solutions improving observability and incident response times</li></ul><h4 style="color: var(--primary); margin-top: 16px; margin-bottom: 12px;">Community &amp; Contribution</h4><p>Active member and contributor of the <a href="https://github.com/lean-delivery" target="_blank" rel="noopener noreferrer"><strong>@lean-delivery</strong></a> organization, working on open-source DevOps tools and best practices.</p>',
  },
  'github-modal': {
    title: 'GitHub Stats Overview',
    content: '<p>Dynamic GitHub statistics highlighting contributions, reviews, discussions, and pull request activity. My GitHub profile showcases continuous learning, active collaboration, and commitment to open-source development.</p><img src="https://github-readme-stats-pavelpikta.vercel.app/api?username=pavelpikta&count_private=true&show=reviews,discussions_started,discussions_answered,prs_merged,prs_merged_percentage&show_icons=true&theme=dracula&line_height=30" alt="GitHub Stats" style="width:100%;border-radius:12px;box-shadow: 0 4px 12px rgba(18, 19, 47, 0.10);" loading="lazy" />',
  },
};

const themeToggle = document.querySelector('.toggle-theme');
const themeIcon = document.getElementById('theme-icon');

function updateTheme(newTheme) {
  document.body.setAttribute('data-theme', newTheme);
  themeIcon.innerHTML = newTheme === 'light'
    ? '<circle cx="12" cy="12" r="8" fill="currentColor"/>'
    : '<path d="M21.64 13.64A9 9 0 1 1 10.36 2.36 6.5 6.5 0 0 0 21.64 13.64Z" fill="currentColor"/>';
  localStorage.setItem('theme', newTheme);
}

themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  updateTheme(current === 'light' ? 'dark' : 'light');
});

(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    updateTheme(saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateTheme(prefersDark ? 'dark' : 'light');
  }
})();

const modalOverlay = document.getElementById('modal-overlay');
const modal = modalOverlay.querySelector('.modal');
const modalClose = modalOverlay.querySelector('.modal-close');
const modalTitle = modalOverlay.querySelector('#modal-title');
const modalContent = modalOverlay.querySelector('#modal-content');

function openModal(id) {
  const data = modalData[id];
  if (data) {
    modalTitle.textContent = data.title;
    modalContent.innerHTML = data.content;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    modal.focus();
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Return focus to the card that opened the modal
  const activeCard = document.querySelector('.card[data-modal-target]:focus, .card[data-modal-target]:active');
  if (activeCard) {
    activeCard.focus();
  }
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

const cards = document.querySelectorAll('.card[data-modal-target]');
cards.forEach(card => {
  card.addEventListener('click', () => {
    const modalId = card.getAttribute('data-modal-target');
    openModal(modalId);
  });
  card.addEventListener('keypress', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const modalId = card.getAttribute('data-modal-target');
      openModal(modalId);
    }
  });
});
