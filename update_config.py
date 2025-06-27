#!/usr/bin/env python3
"""
Script to update remaining hardcoded IP addresses to use config
Run this script to replace remaining hardcoded references
"""

import os
import re
from pathlib import Path

# Define the project root
PROJECT_ROOT = Path(__file__).parent

def replace_in_file(file_path, old_pattern, new_replacement):
    """Replace pattern in file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if old_pattern in content:
            new_content = content.replace(old_pattern, new_replacement)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {file_path}")
            return True
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
    return False

def main():
    # Frontend file patterns to update
    frontend_updates = [
        # Pattern: hardcoded URL -> config usage
        ('http://172.30.6.177:8000', '${config.API_BASE_URL}'),
        ('`http://172.30.6.177:8000${', '${config.getMediaURL('),
        ('http://172.30.6.177:8000/', 'config.API_BASE_URL + "/'),
        # ('http://172.30.8.147:8000', '${config.API_BASE_URL}'),
        # ('`http://172.30.8.147:8000${', '${config.getMediaURL('),
        # ('http://172.30.8.147:8000/', 'config.API_BASE_URL + "/'),
    ]
    
    # Find all .jsx and .js files in frontend
    frontend_dir = PROJECT_ROOT / 'frontend' / 'frontend-vite' / 'src'
    js_files = list(frontend_dir.rglob('*.jsx')) + list(frontend_dir.rglob('*.js'))
    
    print("Updating frontend files...")
    for js_file in js_files:
        # Skip config files
        if 'config.js' in str(js_file):
            continue
            
        # Add import if file contains hardcoded URLs
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if '172.30.8.147' in content and "import config from" not in content:
            # Add config import
            lines = content.split('\n')
            import_lines = []
            other_lines = []
            
            for line in lines:
                if line.strip().startswith('import ') and 'from' in line:
                    import_lines.append(line)
                else:
                    other_lines.append(line)
            
            # Add config import after other imports
            import_lines.append("import config from '../../config/config';")
            new_content = '\n'.join(import_lines) + '\n' + '\n'.join(other_lines)
            
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Added config import to: {js_file}")

if __name__ == '__main__':
    main()
    print("\\nRemaining manual updates needed:")
    print("1. Update image URLs to use: config.getMediaURL(imagePath)")
    print("2. Update API endpoints to use: config.getApiEndpoint('/endpoint')")
    print("3. Check console logs and alert statements")
    print("\\nTo change IP address, edit shared.env file and restart servers.")
