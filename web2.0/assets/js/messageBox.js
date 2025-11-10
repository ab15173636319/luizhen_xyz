class MessageBox {
  // 基础设置
  static DISPLAY_TIME = 3000; // 消息显示时长（毫秒）
  static CLASS_PREFIX = "lz_message"; // CSS类名前缀
  static MESSAGE_TYPES = {
    success: {
      color: "#000",
      background: "#2ecc7180",
      icon: "/assets/icons/success.svg",
    },
    error: {
      color: "#000",
      background: "#e74c3c80",
      icon: "/assets/icons/error.svg",
    },
    warning: {
      color: "#fff",
      background: "#f39c1280",
      icon: "/assets/icons/warning.svg",
    },
    primary: {
      color: "#000",
      background: "#3498db80",
      icon: "/assets/icons/primary.svg",
    },
    info: {
      color: "#000",
      background: "#95a5a680",
      icon: "/assets/icons/info.svg",
    },
  };

  // 缓存DOM元素
  static #messageContainer = null;
  static #styleElement = null;

  /**
   * 创建消息容器（如果不存在的话）
   */
  static #createContainer() {
    if (!MessageBox.#messageContainer) {
      MessageBox.#messageContainer = document.createElement("div");
      MessageBox.#messageContainer.className = MessageBox.CLASS_PREFIX;
      document.body.appendChild(MessageBox.#messageContainer);
    }
    return MessageBox.#messageContainer;
  }

  /**
   * 添加样式到页面
   */
  static #addStyles() {
    if (MessageBox.#styleElement) return;

    const styles = `
      .${MessageBox.CLASS_PREFIX} {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
      }

      .${MessageBox.CLASS_PREFIX}_item {
        margin: 10px auto;
        width: 240px;
        padding: 5px;
        border-radius: 5px;
        pointer-events: auto;
        transition: opacity 0.3s ease;
        animation: move 0.3s ease;
      }

      .${MessageBox.CLASS_PREFIX}_content {
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: clamp(12px, 2vw, 16px);
      }

      .${MessageBox.CLASS_PREFIX}_icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      .${MessageBox.CLASS_PREFIX}_icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .${MessageBox.CLASS_PREFIX}_text {
        flex: 1;
        word-break: break-all;
      }

      .${MessageBox.CLASS_PREFIX}_item.fade-out {
        transform: translateY(-200px);
        opacity: 0;
      }

      @keyframes move {
        from {
            transform: translateY(-2000px);
        }
        to {
            transform: translateY(0px);
        }
}
    `;

    MessageBox.#styleElement = document.createElement("style");
    MessageBox.#styleElement.textContent = styles.trim();
    document.head.appendChild(MessageBox.#styleElement);
  }

  /**
   * 对消息内容进行安全处理，防止XSS攻击
   */
  static #makeSafe(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * 创建并显示一个消息
   */
  static #showMessage(type, message) {
    // 检查消息内容是否有效
    if (typeof message !== "string" || message.trim() === "") {
      throw new Error("消息内容不能为空");
    }

    if (message.length > 100) {
      throw new Error("消息内容不能超过100个字符");
    }

    const safeMessage = MessageBox.#makeSafe(message.trim());

    // 准备容器和样式
    const container = MessageBox.#createContainer();
    MessageBox.#addStyles();

    // 获取当前消息数量
    const messageCount = container.querySelectorAll(
      `.${MessageBox.CLASS_PREFIX}_item`
    ).length;

    // 获取该类型的配置
    const typeConfig =
      MessageBox.MESSAGE_TYPES[type] || MessageBox.MESSAGE_TYPES.info;

    // 创建消息元素
    const messageElement = document.createElement("div");
    messageElement.className = `${MessageBox.CLASS_PREFIX}_item`;
    messageElement.dataset.type = type;
    messageElement.dataset.index = messageCount;
    messageElement.style.width = `${MessageBox.#setContentWidth(
      safeMessage.length
    )}px`;

    // 设置样式
    messageElement.style.backgroundColor = typeConfig.background;
    messageElement.style.color = typeConfig.color;

    // 填充内容
    messageElement.innerHTML = `
      <div class="${MessageBox.CLASS_PREFIX}_content">
        <div class="${MessageBox.CLASS_PREFIX}_icon">
          <img src="${typeConfig.icon}" alt="${type}" loading="lazy" />
        </div>
        <div class="${MessageBox.CLASS_PREFIX}_text">
          ${safeMessage}
        </div>
      </div>
    `;

    // 添加到页面
    container.appendChild(messageElement);

    // 设置自动关闭
    MessageBox.#setupAutoClose(messageElement);

    return messageElement;
  }

  //   设置内容宽度
  static #setContentWidth(messageLen) {
    const currentFontLen = messageLen * MessageBox.#calculateClampedFontSize();
    return 100 + currentFontLen;
  }

  //   获取当前字体大小
  static #calculateClampedFontSize() {
    const viewportWidth = window.innerWidth;
    const vwValue = (viewportWidth * 2) / 100;
    const fontSize = Math.max(12, Math.min(vwValue, 16));
    return fontSize;
  }

  /**
   * 设置消息自动关闭
   */
  static #setupAutoClose(element) {
    const timer = setTimeout(() => {
      // 添加淡出效果
      element.classList.add("fade-out");

      // 动画结束后移除元素
      element.addEventListener(
        "transitionend",
        () => {
          element.remove();
          MessageBox.#checkAndCleanup();
        },
        { once: true }
      );

      clearTimeout(timer);
    }, MessageBox.DISPLAY_TIME);
  }

  /**
   * 检查并清理空容器
   */
  static #checkAndCleanup() {
    const container = MessageBox.#messageContainer;
    if (!container) return;

    const remainingMessages = container.querySelectorAll(
      `.${MessageBox.CLASS_PREFIX}_item`
    );

    if (remainingMessages.length === 0) {
      container.remove();
      MessageBox.#messageContainer = null;
    }
  }


  /**
   * 显示成功消息
   */
  static success(message) {
    return MessageBox.#showMessage("success", message);
  }

  /**
   * 显示错误消息
   */
  static error(message) {
    return MessageBox.#showMessage("error", message);
  }

  /**
   * 显示警告消息
   */
  static warning(message) {
    return MessageBox.#showMessage("warning", message);
  }

  /**
   * 显示主要消息
   */
  static primary(message) {
    return MessageBox.#showMessage("primary", message);
  }

  /**
   * 显示普通信息
   */
  static info(message) {
    return MessageBox.#showMessage("info", message);
  }

  /**
   * 关闭所有消息
   */
  static closeAll() {
    const container = MessageBox.#messageContainer;
    if (container) {
      container
        .querySelectorAll(`.${MessageBox.CLASS_PREFIX}_item`)
        .forEach((item) => item.remove());
      container.remove();
      MessageBox.#messageContainer = null;
    }
  }
}
