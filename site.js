document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  const mediaElements = document.querySelectorAll(".media-load");
  const experienceItems = document.querySelectorAll(".experience-item");
  const heroContactCta = document.querySelector('.hero-right .cta[href="#contato"]');
  const contactMail = document.querySelector(".contact-mail");
  const contactEmail = "ofelipevedova@gmail.com";

  let toast = null;
  let toastText = null;
  let toastTimer = null;

  const ensureToast = () => {
    if (toast) {
      return;
    }

    toast = document.createElement("div");
    toast.className = "site-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = `
      <span class="site-toast-dot" aria-hidden="true"></span>
      <span class="site-toast-text">Email copiado</span>
    `;
    document.body.appendChild(toast);
    toastText = toast.querySelector(".site-toast-text");
  };

  const showToast = (message) => {
    ensureToast();

    if (toastText) {
      toastText.textContent = message;
    }

    toast.classList.add("is-visible");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    helper.style.left = "-9999px";

    document.body.appendChild(helper);
    helper.select();

    let copied = false;

    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(helper);
    return copied;
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  mediaElements.forEach((media) => {
    if (media.complete) {
      media.classList.add("is-loaded");
    } else {
      media.addEventListener("load", () => {
        media.classList.add("is-loaded");
      });

      media.addEventListener("error", () => {
        media.classList.add("is-loaded");
      });
    }
  });

  experienceItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      experienceItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });

  if (heroContactCta) {
    heroContactCta.addEventListener("click", async () => {
      try {
        const copied = await copyToClipboard(contactEmail);
        showToast(copied ? "Email copiado" : "Nao foi possivel copiar o email");
      } catch (error) {
        showToast("Nao foi possivel copiar o email");
      }
    });
  }

  if (contactMail) {
    contactMail.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const copied = await copyToClipboard(contactEmail);
        showToast(copied ? "Email copiado" : "Nao foi possivel copiar o email");
      } catch (error) {
        showToast("Nao foi possivel copiar o email");
      }
    });
  }
});
