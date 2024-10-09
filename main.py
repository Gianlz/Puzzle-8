import customtkinter as ctk

def main():
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("blue")

    root = ctk.CTk()
    root.geometry("700x500")
    root.title("CustomTkinter")

    root.mainloop()

if __name__ == "__main__":
    main()