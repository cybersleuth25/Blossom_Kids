import os
import sys
import subprocess

def install_pillow():
    try:
        import PIL
        print("Pillow library is already installed.")
    except ImportError:
        print("Pillow library not found. Installing now...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
            print("Pillow successfully installed!")
        except Exception as e:
            print(f"Error installing Pillow: {e}")
            print("Please run 'pip install Pillow' manually first.")
            sys.exit(1)

def convert_to_webp():
    from PIL import Image

    images_dir = "images"
    backup_dir = os.path.join(images_dir, "backup_jpg")

    if not os.path.exists(images_dir):
        print(f"Directory '{images_dir}' not found.")
        return []

    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Created backup directory at {backup_dir}")

    converted_files = []

    for filename in os.listdir(images_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            if filename == "logo.png" or filename == "whatsapp.png":
                continue # Skip logo and WhatsApp icons
            
            src_path = os.path.join(images_dir, filename)
            base_name = os.path.splitext(filename)[0]
            dest_name = f"{base_name}.webp"
            dest_path = os.path.join(images_dir, dest_name)

            print(f"Processing: {filename}...")
            try:
                with Image.open(src_path) as img:
                    # Optimize: max width 1920px while preserving aspect ratio
                    max_width = 1920
                    if img.width > max_width:
                        ratio = max_width / float(img.width)
                        new_height = int(float(img.height) * float(ratio))
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                        print(f"  Resized {filename} to {max_width}x{new_height}")

                    # Convert to RGB if it was RGBA (Pillow fails saving RGBA as WebP sometimes)
                    if img.mode in ('RGBA', 'LA'):
                        background = Image.new('RGB', img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[3]) # 3 is the alpha channel
                        img = background

                    # Save as WebP
                    img.save(dest_path, "WEBP", quality=80)
                    print(f"  Compressed and saved as {dest_name}")
                
                # Move original file to backup folder
                backup_path = os.path.join(backup_dir, filename)
                if os.path.exists(backup_path):
                    os.remove(backup_path) # Overwrite existing backup file
                os.rename(src_path, backup_path)
                print(f"  Moved original to {backup_path}")
                
                converted_files.append(filename)

            except Exception as e:
                print(f"  Failed to process {filename}: {e}")

    return converted_files

def update_code_references(converted_files):
    if not converted_files:
        print("No files converted. Skipping code reference updates.")
        return

    files_to_update = ["Index.html", "script.js"]
    
    for filename in files_to_update:
        if not os.path.exists(filename):
            print(f"Code file {filename} not found.")
            continue
            
        print(f"Updating references in {filename}...")
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            replacements = 0
            for orig_name in converted_files:
                base_name = os.path.splitext(orig_name)[0]
                orig_ext = os.path.splitext(orig_name)[1]
                
                # Search and replace
                orig_ref = f"images/{orig_name}"
                new_ref = f"images/{base_name}.webp"
                
                if orig_ref in content:
                    content = content.replace(orig_ref, new_ref)
                    replacements += 1
                    print(f"  Replaced {orig_ref} -> {new_ref}")
                    
                # Case variation check
                orig_ref_case = f"images/{orig_name.lower()}"
                if orig_ref_case in content.lower():
                    # Handle index based replacement for case-insensitive matches
                    # Since we want to preserve exact matches, a simple check works
                    content = content.replace(orig_ref_case, new_ref)

            if replacements > 0:
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Successfully updated {replacements} references in {filename}!")
            else:
                print(f"No references to replace found in {filename}.")
                
        except Exception as e:
            print(f"Error updating references in {filename}: {e}")

if __name__ == "__main__":
    print("=== Blossom Kids Asset Optimizer ===")
    install_pillow()
    converted = convert_to_webp()
    update_code_references(converted)
    print("=== Asset Optimization Done! ===")
