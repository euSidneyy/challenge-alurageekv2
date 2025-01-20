const productList = document.getElementById("product-list");
const form = document.getElementById("add-product-form");

const apiURL = "http://localhost:3000/produtos";

async function fetchAndRenderProducts() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Erro ao buscar produtos.");
    const products = await response.json();

    productList.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <div class="price-trash-container">
          <p>R$ ${product.price}</p>
          <button onclick="deleteProduct('${product.id}')">
            <img src="https://img.icons8.com/ios-glyphs/30/ffffff/trash.png" alt="Excluir">
          </button>
        </div>
      `;

      productList.appendChild(productCard);
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("product-name").value.trim();
  const price = document.getElementById("product-price").value.trim();
  const image = document.getElementById("product-image").value.trim();

  if (!name || !price || !image) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Erro ao buscar produtos para calcular ID.");

    const products = await response.json();
    const nextId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id))) + 1 : 1;

    const postResponse = await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: String(nextId),
        name,
        price,
        image,
      }),
    });

    if (postResponse.ok) {
      form.reset();
      fetchAndRenderProducts();
    } else {
      console.error("Erro ao adicionar produto:", postResponse.statusText);
    }
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${apiURL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchAndRenderProducts();
    } else {
      console.error("Erro ao excluir produto:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
  }
}

form.addEventListener("submit", addProduct);

fetchAndRenderProducts();
