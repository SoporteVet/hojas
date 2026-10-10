/**
 * Autorización para retiro o entrega (dejar) de mascota por tercera persona.
 * Checkbox junto a la firma principal; hoja adicional en PDF con firma duplicada.
 */
(function () {
    'use strict';

    const OWNER_NAME_IDS = ['ownerName', 'declOwner'];
    const OWNER_CEDULA_IDS = ['ownerCedula', 'ownerId'];
    const PET_NAME_IDS = ['petName', 'declPet'];

    function firstValue(ids) {
        for (const id of ids) {
            const el = document.getElementById(id);
            if (el && el.value && el.value.trim()) return el.value.trim();
        }
        for (const id of ids) {
            const el = document.getElementById(id);
            if (el) return el.value || '';
        }
        return '';
    }

    function findPrimarySignatureCanvas() {
        const canvases = Array.from(
            document.querySelectorAll('canvas.signature-pad, canvas[id$="SigPad"]')
        );
        return canvases.find((c) => c.id && c.id !== 'autorizacionRetiroFirmaDuplicadaCanvas');
    }

    function getLogoSrc() {
        const img = document.querySelector('.container .logo, .header .logo, img.logo');
        return img ? img.getAttribute('src') || 'logo.jpg' : 'logo.jpg';
    }

    function getAutorizacionAccionSeleccionada() {
        const selected = document.querySelector('input[name="autorizacionAccionTercero"]:checked');
        return selected ? selected.value : '';
    }

    function updateAutorizacionAccionText() {
        const accion = getAutorizacionAccionSeleccionada();
        const titulo = document.getElementById('autRetiroTituloHoja');
        const p1 = document.getElementById('autRetiroParrafo1');
        const p2 = document.getElementById('autRetiroParrafo2');
        const etiquetaAccion = document.getElementById('autRetiroEtiquetaAccion');
        if (!p1 || !p2) return;

        const owner = firstValue(OWNER_NAME_IDS) || '_______________________';
        const cedula = firstValue(OWNER_CEDULA_IDS) || '_______________________';
        const pet = firstValue(PET_NAME_IDS) || '_______________________';

        if (accion === 'dejar') {
            if (titulo) {
                titulo.textContent =
                    'AUTORIZACIÓN PARA DEJAR MASCOTA EN CLÍNICA POR TERCERA PERSONA';
            }
            if (etiquetaAccion) etiquetaAccion.textContent = 'DEJAR (entrega en clínica)';
            p1.textContent =
                `Yo, ${owner}, con número de cédula ${cedula}, en mi calidad de propietario(a) de la mascota ${pet}, declaro que por motivos personales no podré dejar personalmente a mi mascota en la Clínica Veterinaria San Martín de Porres.`;
            p2.innerHTML =
                'Por medio del presente documento <strong>autorizo expresamente</strong> a la siguiente persona para que <strong>deje</strong> a mi mascota en la clínica en mi nombre y representación, con facultades para entregar la mascota y la información relacionada con dicha entrega:';
        } else if (accion === 'retirar') {
            if (titulo) {
                titulo.textContent =
                    'AUTORIZACIÓN PARA RETIRAR MASCOTA POR TERCERA PERSONA';
            }
            if (etiquetaAccion) etiquetaAccion.textContent = 'RETIRAR';
            p1.textContent =
                `Yo, ${owner}, con número de cédula ${cedula}, en mi calidad de propietario(a) de la mascota ${pet}, declaro que por motivos personales no podré retirar personalmente a mi mascota de la Clínica Veterinaria San Martín de Porres.`;
            p2.innerHTML =
                'Por medio del presente documento <strong>autorizo expresamente</strong> a la siguiente persona para que <strong>retire</strong> a mi mascota en mi nombre y representación, con facultades para recibir la mascota y la información relacionada con su retiro:';
        } else {
            if (titulo) {
                titulo.textContent =
                    'AUTORIZACIÓN PARA RETIRAR O DEJAR MASCOTA POR TERCERA PERSONA';
            }
            if (etiquetaAccion) etiquetaAccion.textContent = '(seleccione retirar o dejar)';
            p1.textContent =
                `Yo, ${owner}, con número de cédula ${cedula}, en mi calidad de propietario(a) de la mascota ${pet}, declaro que por motivos personales no podré retirar o dejar personalmente a mi mascota en la Clínica Veterinaria San Martín de Porres, según se indica en este documento.`;
            p2.innerHTML =
                'Por medio del presente documento <strong>autorizo expresamente</strong> a la siguiente persona para actuar en mi nombre y representación, según la acción indicada:';
        }
    }

    function buildAuthorizationPage(logoSrc) {
        const page = document.createElement('div');
        page.id = 'autorizacionRetiroTerceroPage';
        page.className = 'autorizacion-retiro-tercero-page';
        page.style.display = 'none';
        page.innerHTML = `
            <div class="header" style="display:flex;align-items:center;margin-bottom:20px;border-bottom:3px solid #4a90e2;padding-bottom:15px;justify-content:space-between;">
                <img src="${logoSrc}" alt="Veterinaria San Martín de Porres" class="logo" style="max-width:80px;margin-right:15px;border:none;border-radius:0;box-shadow:none;">
                <h1 id="autRetiroTituloHoja" style="text-align:center;margin:0;color:#4a90e2;flex-grow:1;font-size:1.35rem;">AUTORIZACIÓN PARA RETIRAR O DEJAR MASCOTA POR TERCERA PERSONA</h1>
                <div class="date-short autorizacion-retiro-fecha"></div>
            </div>
            <p style="margin:0 0 12px;font-weight:600;color:#4a90e2;">Acción autorizada: <span id="autRetiroEtiquetaAccion">(seleccione retirar o dejar)</span></p>
            <p id="autRetiroParrafo1" style="text-align:justify;line-height:1.8;"></p>
            <p id="autRetiroParrafo2" style="text-align:justify;line-height:1.8;"></p>
            <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:20px 0;">
                <p><strong>Nombre completo:</strong> <input type="text" id="terceroNombre" placeholder="Nombre de la persona autorizada" style="min-width:280px;border:none;border-bottom:2px solid #d1e7f0;font-weight:bold;padding:6px 10px;"></p>
                <p><strong>Cédula:</strong> <input type="text" id="terceroCedula" placeholder="Cédula" style="min-width:200px;border:none;border-bottom:2px solid #d1e7f0;font-weight:bold;padding:6px 10px;"></p>
                <p><strong>Teléfono:</strong> <input type="tel" id="terceroTelefono" placeholder="Teléfono de contacto" style="min-width:200px;border:none;border-bottom:2px solid #d1e7f0;font-weight:bold;padding:6px 10px;"></p>
            </div>
            <p style="text-align:justify;line-height:1.8;">
                Ratifico que la firma que aparece a continuación es la misma que firmé en el consentimiento principal de este expediente, y con ella confirmo esta autorización sin necesidad de firmar nuevamente.
            </p>
            <div class="signature-area" style="display:flex;justify-content:center;margin-top:30px;">
                <div class="firma-container" style="width:100%;max-width:100%;">
                    <div class="signature-box" style="width:100%;padding:10px;text-align:center;margin-bottom:10px;border-radius:5px;background:#f8f9fa;font-weight:500;">
                        Firma del propietario (copia del consentimiento principal)
                    </div>
                    <div style="width:100%;min-height:200px;border:2px dashed #d1e7f0;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;padding:10px;">
                        <img id="autorizacionRetiroFirmaDuplicada" alt="Firma del propietario" style="max-width:100%;max-height:220px;display:none;">
                    </div>
                </div>
            </div>
        `;
        return page;
    }

    function buildCheckboxSection() {
        const section = document.createElement('div');
        section.className = 'autorizacion-retiro-checkbox-section checkbox-section';
        section.style.cssText = 'margin:24px 0;padding:15px;background:#f8f9fa;border-radius:8px;border-left:4px solid #4a90e2;';
        section.innerHTML = `
            <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:1rem;line-height:1.5;">
                <input type="checkbox" id="chkAutorizacionRetiroTercero" style="margin-top:4px;transform:scale(1.2);flex-shrink:0;">
                <span>No podré <strong>retirar o dejar</strong> personalmente a mi mascota y <strong>autorizo a otra persona</strong> para hacerlo. Al marcar esta opción se incluirá la hoja de autorización en el PDF (su firma del consentimiento se copiará automáticamente).</span>
            </label>
            <div id="autorizacionAccionTerceroOpciones" style="display:none;margin-top:14px;padding:12px 12px 12px 28px;background:#fff;border-radius:6px;border:1px solid #d1e7f0;">
                <p style="margin:0 0 10px;font-weight:600;">Especifique la acción:</p>
                <label style="display:block;margin:8px 0;cursor:pointer;line-height:1.5;">
                    <input type="radio" name="autorizacionAccionTercero" value="retirar" style="margin-right:8px;transform:scale(1.1);">
                    No podré <strong>retirar</strong> personalmente; autorizo a un tercero para <strong>retirar</strong> a mi mascota.
                </label>
                <label style="display:block;margin:8px 0;cursor:pointer;line-height:1.5;">
                    <input type="radio" name="autorizacionAccionTercero" value="dejar" style="margin-right:8px;transform:scale(1.1);">
                    No podré <strong>dejar</strong> personalmente; autorizo a un tercero para <strong>dejar</strong> a mi mascota en la clínica.
                </label>
            </div>
        `;
        return section;
    }

    function syncRetiroTerceroFields() {
        updateAutorizacionAccionText();
    }

    function updateMirroredSignature(primaryId) {
        const pad = window.signaturePads && window.signaturePads[primaryId];
        const img = document.getElementById('autorizacionRetiroFirmaDuplicada');
        if (!pad || !img) return;
        if (pad.isEmpty()) {
            img.removeAttribute('src');
            img.style.display = 'none';
        } else {
            img.src = pad.toDataURL('image/png');
            img.style.display = 'block';
        }
    }

    function setPageIncludedInPdf(include) {
        const page = document.getElementById('autorizacionRetiroTerceroPage');
        if (!page) return;
        if (include) {
            page.classList.add('container');
            page.style.display = '';
        } else {
            page.classList.remove('container');
            page.style.display = 'none';
        }
    }

    function hookSignaturePad(primaryId) {
        const attach = () => {
            const pad = window.signaturePads && window.signaturePads[primaryId];
            if (!pad) return false;
            pad.addEventListener('endStroke', () => updateMirroredSignature(primaryId));
            return true;
        };
        if (!attach()) {
            const interval = setInterval(() => {
                if (attach()) clearInterval(interval);
            }, 200);
            setTimeout(() => clearInterval(interval), 12000);
        }
    }

    function patchClearSignature(primaryId) {
        if (window._autorizacionRetiroClearPatched) return;
        window._autorizacionRetiroClearPatched = true;
        const original = window.clearSignature;
        window.clearSignature = function (id) {
            if (typeof original === 'function') {
                original(id);
            } else if (window.signaturePads && window.signaturePads[id]) {
                window.signaturePads[id].clear();
            }
            if (id === primaryId) updateMirroredSignature(primaryId);
        };
    }

    function validateAutorizacionRetiroTercero(primaryId) {
        const chk = document.getElementById('chkAutorizacionRetiroTercero');
        if (!chk || !chk.checked) return true;
        syncRetiroTerceroFields();
        updateMirroredSignature(primaryId);
        const nombre = (document.getElementById('terceroNombre')?.value || '').trim();
        const cedula = (document.getElementById('terceroCedula')?.value || '').trim();
        const pad = window.signaturePads && window.signaturePads[primaryId];
        const accion = getAutorizacionAccionSeleccionada();
        if (!accion) {
            alert('Seleccione si la autorización es para retirar o para dejar a la mascota en la clínica.');
            return false;
        }
        updateAutorizacionAccionText();
        if (!nombre || !cedula) {
            alert('Complete el nombre y la cédula de la persona autorizada.');
            return false;
        }
        if (!pad || pad.isEmpty()) {
            alert('Firme el consentimiento principal antes de generar el PDF.');
            return false;
        }
        setPageIncludedInPdf(true);
        return true;
    }

    window.appendAutorizacionRetiroTerceroToJsPdf = async function (pdf, options) {
        const chk = document.getElementById('chkAutorizacionRetiroTercero');
        const page = document.getElementById('autorizacionRetiroTerceroPage');
        if (!chk || !chk.checked || !page || typeof html2canvas !== 'function') return;

        const primaryId = window.__autorizacionRetiroPrimaryPadId;
        if (!validateAutorizacionRetiroTercero(primaryId)) {
            throw new Error('autorizacion_retiro_invalid');
        }

        const imgW = (options && options.imgW) || 190;
        page.classList.add('container');
        page.style.display = '';

        pdf.addPage();
        const canvas = await html2canvas(page, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: '#fff',
            width: page.scrollWidth,
            height: page.scrollHeight
        });
        const img = canvas.toDataURL('image/jpeg', 0.8);
        const imgH = (canvas.height * imgW) / canvas.width;
        pdf.addImage(img, 'JPEG', 10, 10, imgW, imgH);
    };

    function patchGenerateAndUploadPDF() {
        if (window._autorizacionRetiroDrivePatched || typeof window.generateAndUploadPDF !== 'function') return;
        window._autorizacionRetiroDrivePatched = true;
        const original = window.generateAndUploadPDF;
        window.generateAndUploadPDF = async function (opts) {
            const chk = document.getElementById('chkAutorizacionRetiroTercero');
            if (chk && chk.checked && opts && Array.isArray(opts.pageElements)) {
                if (!opts.pageElements.includes('autorizacionRetiroTerceroPage')) {
                    const obsIdx = opts.pageElements.findIndex((id) =>
                        /observaciones|Page3$/i.test(id)
                    );
                    if (obsIdx >= 0) {
                        opts.pageElements = [
                            ...opts.pageElements.slice(0, obsIdx),
                            'autorizacionRetiroTerceroPage',
                            ...opts.pageElements.slice(obsIdx)
                        ];
                    } else {
                        opts.pageElements = [...opts.pageElements, 'autorizacionRetiroTerceroPage'];
                    }
                }
            }
            return original(opts);
        };
    }

    function patchGeneratePDF(primaryId) {
        if (window._autorizacionRetiroPDFPatched) return;
        const original = window.generatePDF;
        if (typeof original !== 'function') return;
        window._autorizacionRetiroPDFPatched = true;
        window.generatePDF = async function () {
            if (!validateAutorizacionRetiroTercero(primaryId)) return;
            return original.apply(this, arguments);
        };
    }

    function bindFieldSync() {
        const allIds = [...OWNER_NAME_IDS, ...OWNER_CEDULA_IDS, ...PET_NAME_IDS];
        allIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', syncRetiroTerceroFields);
                el.addEventListener('change', syncRetiroTerceroFields);
            }
        });
    }

    function init() {
        if (document.getElementById('chkAutorizacionRetiroTercero')) return;

        const primaryCanvas = findPrimarySignatureCanvas();
        if (!primaryCanvas || !primaryCanvas.id) return;

        const primaryId = primaryCanvas.id;
        window.__autorizacionRetiroPrimaryPadId = primaryId;

        const signatureBlock =
            primaryCanvas.closest('.signature-area') ||
            primaryCanvas.closest('.signature-section') ||
            primaryCanvas.closest('.signature-container')?.parentElement ||
            primaryCanvas.parentElement;

        const checkboxSection = buildCheckboxSection();
        if (signatureBlock && signatureBlock.parentNode) {
            signatureBlock.parentNode.insertBefore(checkboxSection, signatureBlock.nextSibling);
        } else {
            document.body.appendChild(checkboxSection);
        }

        const hostContainer = primaryCanvas.closest('.container') || primaryCanvas.closest('#altaPage2');
        const page = buildAuthorizationPage(getLogoSrc());
        const fechaEl = page.querySelector('.autorizacion-retiro-fecha');
        if (fechaEl) {
            fechaEl.textContent = new Date().toLocaleDateString('es-ES');
        }

        if (hostContainer && hostContainer.parentNode) {
            hostContainer.parentNode.insertBefore(page, hostContainer.nextSibling);
        } else {
            document.body.appendChild(page);
        }

        const chk = document.getElementById('chkAutorizacionRetiroTercero');
        const opcionesAccion = document.getElementById('autorizacionAccionTerceroOpciones');
        chk.addEventListener('change', function () {
            if (opcionesAccion) {
                opcionesAccion.style.display = this.checked ? 'block' : 'none';
            }
            setPageIncludedInPdf(this.checked);
            if (this.checked) {
                syncRetiroTerceroFields();
                updateMirroredSignature(primaryId);
            } else {
                document.querySelectorAll('input[name="autorizacionAccionTercero"]').forEach((r) => {
                    r.checked = false;
                });
                updateAutorizacionAccionText();
            }
        });

        document.querySelectorAll('input[name="autorizacionAccionTercero"]').forEach((radio) => {
            radio.addEventListener('change', () => {
                syncRetiroTerceroFields();
            });
        });

        bindFieldSync();
        syncRetiroTerceroFields();
        hookSignaturePad(primaryId);
        patchClearSignature(primaryId);
        patchGeneratePDF(primaryId);
        patchGenerateAndUploadPDF();
    }

    function start() {
        setTimeout(init, 400);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
