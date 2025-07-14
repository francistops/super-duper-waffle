import { getLogs } from '../../script/auth.js'

class DisplayLogElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                * {
                font-size: 0.7rem;
                }
                table, thead, tbody, tr, th, td {
                    border: 1px solid salmon;
                }
            </style>
            <p>please remain calm while reading the log</p> 
            <button id="getLogs">get logs</button>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Level</th>
                        <th>Method</th>
                        <th>Route</th>
                        <th>Status</th>
                        <th>Message</th>
                        <th>user_agent</th>
                        <th>error_message</th>
                        <th>stack_trace</th>
                    </tr>
                </thead>
                <tbody id="bodyData">
                </tbody>
            </table>
        `.trim();
    }

    async connectedCallback() {
        const btn = this.shadowRoot.getElementById('getLogs');
        btn.addEventListener('click', async e => {
            this.shadowRoot.querySelector('tbody').innerHTML = '';
            const logs = await getLogs();
            
            for (let i = 0; i < logs.length; i++) {
                const log = logs[i];
                this.addData(log);
            }
        });
    }

    addData(log) {
        const tb = this.shadowRoot.querySelector('tbody');
        const trTag = document.createElement('tr');
        trTag.id = log.id;

        [
            log.timestamp,
            log.level,
            log.method,
            log.route,
            log.status,
            log.message,
            log.user_agent,
            log.error_message,
            log.stack_trace

        ].forEach(field => {
            trTag.appendChild(document.createElement('td')).innerHTML = field
        });

        tb.appendChild(trTag);
    }
}


customElements.define('display-log', DisplayLogElement);
